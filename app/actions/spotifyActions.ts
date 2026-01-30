'use server'

export async function searchSpotify(query: string) {
  if (!query) return [];

  try {

    const client_id = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
    const client_secret = process.env.SPOTIFY_CLIENT_SECRET; 

    // 2. 토큰 발급 
    const authRes = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + (Buffer.from(client_id + ':' + client_secret).toString('base64')),
      },
      body: 'grant_type=client_credentials',
      cache: 'no-store' // 캐시 방지
    });
    
    const authData = await authRes.json();
    const token = authData.access_token;

    // 3. 검색 요청
    const searchRes = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=10`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    

    const data = await searchRes.json();
    
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