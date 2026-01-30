'use client';
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { playlistService } from "@/services/playlistService";
import { useTabStore } from "@/app/store/useTabStore";
import { Button } from "@/components/ui/button";
import { spotifyService } from "@/services/spotifyService";
import { searchSpotify } from "@/app/actions/spotifyActions";

export default function SearchBar({roomId,onMusicAdded}:{ roomId: string, onMusicAdded:(track:any) => void} ) {
    const [searchQuery,setSearchQuery] =useState('');
    const [searchList,setSearchList] =useState<any[]>([]);
     const setTab=useTabStore((state)=>state.setTab);
    
 useEffect(() => {
   

    if (searchQuery.length < 2) {
        setSearchList([]);
        return;
    }
    // 2. 검색 실행 함수
    const searchTracks = async () => {
        try {
            // const tracks = await spotifyService.search(searchQuery);
            // console.log(tracks," 트랙 값 까보기");
            const  rawTracks= await searchSpotify(searchQuery);
            console.log(rawTracks,"rawTracks");
            setSearchList(rawTracks);
        } catch (error) {
            console.error("검색 실패:", error);
            setSearchList([]);
        }
    };

    const timer = setTimeout(searchTracks, 500);

    return () => clearTimeout(timer);
}, [searchQuery]);

  const handleAddTrack=async (trackId,trackName,artist,albumArt,trackUri)=>{
    // room_id, track_id,track_name,artist_name , album_art , trackUri
     const {track,isDuplicate} = await playlistService.addTrack(roomId,trackId,trackName,artist,albumArt,trackUri);
     console.log(track.tracks,"핸들 애드 트랙,");
     if(track && !isDuplicate){
       onMusicAdded(track);
     }
  }


    return( 
      <div className="p-6 flex flex-col h-full bg-white">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">노래 검색하기</h2>

      <div className="relative mb-8">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value) }
          placeholder="듣고싶은 노래를 추가해주세요."
          className="w-full p-4 pl-12 bg-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
        />
        <span className="absolute left-4 top-4 text-gray-400"></span>
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
              추가
              </button>
            </div>
        ))}
      </div>
      <Button
       onClick={() => setTab('PLAYLIST')}
      >x</Button>
      
      <div className="mt-6 pt-6 border-t border-gray-100">
        <p className="text-sm font-semibold text-gray-400"></p>
      </div>
    </div>
      )

}