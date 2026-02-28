

import { spotifyTokenManager } from "@/lib/spotify/spotifyTokenManager";
import { redis } from '../lib/redis';

const BASE_URL="https://api.spotify.com/v1/"

// 공용 토큰
async function getAppToken(): Promise<string> {
  const CACHE_KEY = 'spotify:app_token';
  const cached = await redis.get<string>(CACHE_KEY);
  
  const client_id = process.env.NEXT_PUBLIC_CLIENT_ID;
  const client_secret = process.env.NEXT_PUBLIC_CLIENT_SECRET; 
  if (cached) return cached;

  const authRes = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'Basic ' + Buffer.from(`${client_id}:${client_secret}`).toString('base64'),
    },
    body: 'grant_type=client_credentials',
  });

  if (!authRes.ok) throw new Error("공용 토큰 발급 실패");
  const data = await authRes.json();
  
  await redis.set(CACHE_KEY, data.access_token, { ex: 3500 });
  return data.access_token;
}
// 2. spotifyFetch에 옵션(isPublic)을 추가합니다.
interface SpotifyFetchOptions extends RequestInit {
  isPublic?: boolean; // 이 값이 true면 공용(앱) 토큰을 사용!
}

const spotifyFetch = async (endpoint: string, options: SpotifyFetchOptions = {}) => {
  const token = options.isPublic 
    ? await getAppToken() 
    : await spotifyTokenManager.getToken();

  const BASE_URL = 'https://api.spotify.com/v1/';
  
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`, 
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({})); 
    console.error("Spotify API Error Detail:", errorBody);
    throw new Error(`Spotify API Error: ${res.status} ${res.statusText}`);
  }

  if (res.status === 204) return null;
  return res.json();
};

export const spotifyService = {
 
  fetch: spotifyFetch,

  async play(deviceId: string, trackUri: string) {
    if (!deviceId) return;

    try {
      await spotifyFetch(`me/player/play?device_id=${deviceId}`, {
        method: 'PUT',
        body: JSON.stringify({
          uris: [trackUri],
        }),
      });
    } catch (error) {
      console.error(" 재생 실패:", error);
    }
  },


  async pause(deviceId: string) {
    if (!deviceId) return;

    try {
      await spotifyFetch(`me/player/pause?device_id=${deviceId}`, {
        method: 'PUT',
      });
    } catch (error) {
      console.error(" 일시정지 실패:", error);
    }
  },

   
  async transferPlayback(deviceId: string) {
    return spotifyFetch('/me/player', {
      method: 'PUT',
      body: JSON.stringify({
        device_ids: [deviceId],
        play: false, // true로 하면 바로 재생됨
      }),
    });
  },
 
  async search(query: string) {
    if (!query) return [];
    const CACHE_KEY = `spotify:search:${query}`;

    try {
      const cachedSearch = await redis.get<any[]>(CACHE_KEY);
    
      if (cachedSearch) {
        return cachedSearch;
      }

      const data = await spotifyFetch(`search?q=${encodeURIComponent(query)}&type=track&limit=5`, {
        method: 'GET',
        isPublic: true, 
      });

      const mappedResults = data.tracks.items.map((item: any) => ({
        id: item.id,
        name: item.name,
        artist: item.artists[0]?.name || 'Unknown Artist',
        albumArt: item.album.images[0]?.url || '',
        uri: item.uri,
      }));

      await redis.set(CACHE_KEY, mappedResults, { ex: 3600 });
      return mappedResults;

    } catch (error) {
      console.error("Spotify Search Error:", error);
      return [];
    }
  }
};