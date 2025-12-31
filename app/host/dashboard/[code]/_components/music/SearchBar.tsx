'use client';
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function SearchBar({roomId,onMusicAdded}:{ roomId: string, onMusicAdded:() => void} ) {
    const [searchQuery,setSearchQuery] =useState('');
    const [searchList,setSearchList] =useState<any[]>([]);
 
 useEffect (()=>{
    if(searchQuery.length<2){
        setSearchList([]);
        return;
    }
    const searchTracks = async () => {
        const { data:{session}} =await supabase.auth.getSession();
        const spotifyToken=session?.provider_token;
        if(!spotifyToken){
            console.error("spotify �넗�겙 x");
            return;
        }
        try{
            const response =await fetch(
           `https://api.spotify.com/v1/search?q=${encodeURIComponent(searchQuery)}&type=track&limit=5`,
          {
            headers: { Authorization: `Bearer ${spotifyToken}`,
                        'Content-Type': 'application/json' 
            }
          }
        );
        const data =await response.json();
        const tracks=data.tracks.items.map((item: any)=>({
            id:item.id,
            name:item.name,
            artist:item.artists[0].name,
            albumArt:item.album.images[0]?.url || '',
            uri:item.uri
        }));
        setSearchList(tracks);
        }catch(error){
            console.error("寃��깋 以� �뿉�윭 諛쒖깮",error);
        }
    }

    const timer = setTimeout(searchTracks,500);
    return ()=> clearTimeout(timer);
 } , [searchQuery]);

  const handleAddTrack=async (trackId,trackName,artist,albumArt,trackUri)=>{
    // room_id, track_id,track_name,artist_name , album_art , trackUri
     const {error} =await supabase.from('playlist').insert({
        room_id:roomId,
        track_id:trackId,
        track_name:trackName,
        artist_name:artist,
        album_art:albumArt,
        track_uri:trackUri,
     })
     onMusicAdded();
  }

    return( 
      <div className="p-6 flex flex-col h-full bg-white">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">노래 검색하기</h2>

      {/* 寃��깋李� �쁺�뿭 */}
      <div className="relative mb-8">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value) }
          placeholder="노래"
          className="w-full p-4 pl-12 bg-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
        />
        <span className="absolute left-4 top-4 text-gray-400">검색하기</span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3">
        {searchList.map((track) => (
          <div 
            key={track.id} 
            className="flex items-center p-3 hover:bg-gray-50 rounded-xl border border-transparent hover:border-gray-200 transition-all group"
          >
            <img src={track.albumArt} alt={track.name} className="w-12 h-12 rounded-lg shadow-sm" />
            
            <div className="ml-4 flex-1">
              <p className="font-semibold text-gray-900 leading-tight">{track.name}</p>
              <p className="text-sm text-gray-500">{track.artist}</p>
            </div>

            <button className="opacity-0 group-hover:opacity-100 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-medium transition-all hover:bg-green-600"
            onClick={()=> handleAddTrack(track.id,track.name,track.artist,track.albumArt,track.uri)}>
              검색하기
              </button>
            </div>
        ))}
      </div>
      
      <div className="mt-6 pt-6 border-t border-gray-100">
        <p className="text-sm font-semibold text-gray-400">현재 진행중인 트랙</p>
      </div>
    </div>
      )

}