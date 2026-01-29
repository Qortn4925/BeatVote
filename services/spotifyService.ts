"use client"

import { spotifyTokenManager } from "@/lib/spotifyTokenManager";

const BASE_URL="https://api.spotify.com/v1/"


// 내부에서만 쓸 헬퍼 함수 (객체 밖으로 빼서 재사용성을 높임)
const spotifyFetch = async (endpoint: string, options: RequestInit = {}) => {
  // 1. 매니저에게 유효한 토큰을 달라고 함 (만료됐으면 알아서 갱신해옴)
  const token = await spotifyTokenManager.getToken();

  // 2. 요청 전송
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  // 3. 에러 처리
  if (!res.ok) {
    // Spotify는 에러 내용을 body에 담아줄 때가 많음
    const errorBody = await res.json().catch(() => ({})); 
    console.error("Spotify API Error Detail:", errorBody);
    throw new Error(`Spotify API Error: ${res.status} ${res.statusText}`);
  }

  // 4. 응답 처리 
  if (res.status === 204) {
    return null;
  }

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
      console.log(" 재생 시작:", trackUri);
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
      console.log(" 일시정지 성공");
    } catch (error) {
      console.error(" 일시정지 실패:", error);
    }
  },

  async search(query: string) {
    const data = await spotifyFetch(`/search?q=${encodeURIComponent(query)}&type=track&limit=5`);

    if (!data?.tracks?.items) return [];

    return data.tracks.items.map((item: any) => ({
      id: item.id,
      name: item.name,
      artist: item.artists[0].name,
      albumArt: item.album.images[0]?.url || '',
      uri: item.uri,
    }));
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
};