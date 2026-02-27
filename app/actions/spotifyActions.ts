'use server'

import { redis } from "@/lib/redis";

export async function searchSpotify(query: string) {
  if (!query) return [];

  try {

    const client_id = process.env.NEXT_PUBLIC_CLIENT_ID;
    const client_secret = process.env.NEXT_PUBLIC_CLIENT_SECRET; 
    const cacheKey = `spotify:search:${query}`;

   if (!client_id || !client_secret) {
      return [];
    }

    // 2. 토큰 발급 
   const authRes = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization:
        'Basic ' +
        Buffer.from(
          `${process.env.NEXT_PUBLIC_CLIENT_ID}:${process.env.NEXT_PUBLIC_CLIENT_SECRET}`
        ).toString('base64'),
    },
    body: 'grant_type=client_credentials',
  });
    
    const authData = await authRes.json();
    const token = authData.access_token;
     const redisResult=redis.get(cacheKey);

     if(redisResult===null) {
      
     }
    // 3. 검색 요청
    const searchRes = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=5`,
      {
        headers: { Authorization: `Bearer ${token}`, },
        
      }
    );
    const data = await searchRes.json();

    // 🚨 검색 실패 시 로그 찍고 종료
    if (!searchRes.ok) {
      console.error("❌ 검색 요청 실패:", data);
      return [];
    }


    // 4. 데이터 구조 안전하게 확인 (Optional Chaining)
    if (!data.tracks || !data.tracks.items) {
      console.error("❌ 데이터 구조가 이상함:", data);
      return [];
    }

    // 4. 결과 반환 (필요한 데이터만 추려서)
      return data.tracks.items.map((item: any) => ({
      id: item.id,
      name: item.name,
      artist: item.artists[0].name,
      albumArt: item.album.images[0]?.url || '',
      uri: item.uri,
    }));

  } catch (error) {
    console.error("Spotify Search Error:", error);
    return [];
  }
}