"use client"

import { spotifyTokenManager } from "@/lib/spotify/spotifyTokenManager";


const BASE_URL="https://api.spotify.com/v1/"

// 1. 공용 토큰을 가져오는 함수는 완전히 분리합니다. (아까 우리가 TDD로 기획했던 그 녀석)
const getAppToken = async () => {
  // 여기서 Redis 캐시를 확인하고, 없으면 accounts.spotify.com 에 POST 요청을 보내서
  // 토큰을 받아오고 Redis에 저장하는 로직이 들어갑니다.
  // (이건 spotifyFetch를 쓰지 않고 순수 fetch를 씁니다)
  return "발급받거나_캐시된_공용토큰"; 
};

// 2. spotifyFetch에 옵션(isPublic)을 추가합니다.
interface SpotifyFetchOptions extends RequestInit {
  isPublic?: boolean; // 이 값이 true면 공용(앱) 토큰을 사용!
}

const spotifyFetch = async (endpoint: string, options: SpotifyFetchOptions = {}) => {
  // 핵심: isPublic 옵션에 따라 매니저에게 물어볼지, Redis 공용 토큰을 쓸지 결정
  const token = options.isPublic 
    ? await getAppToken() 
    : await spotifyTokenManager.getToken();

  const BASE_URL = 'https://api.spotify.com/v1/';
  
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`, // 공용이든 개인이든 어차피 Bearer 형식은 똑같음!
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
  // 필요하면 외부에서도 raw fetch를 쓸 수 있게 노출
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

  // 
  async transferPlayback(deviceId: string) {
    return spotifyFetch('/me/player', {
      method: 'PUT',
      body: JSON.stringify({
        device_ids: [deviceId],
        play: false, // true로 하면 바로 재생됨
      }),
    });
  },
  // 
  async search(query: string) {
    return spotifyFetch(`search?q=${encodeURIComponent(query)}&type=track&limit=5`, {
      method: 'GET',
      isPublic: true, // 💡 핵심: "이건 공용 토큰 써줘!" 라고 명시
    });
  }

};