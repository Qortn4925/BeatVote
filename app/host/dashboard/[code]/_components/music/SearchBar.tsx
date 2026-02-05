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
     const {track,isDuplicate} = await playlistService.addTrack(roomId,trackId,trackName,artist,albumArt,trackUri);
     console.log(track.tracks,"핸들 애드 트랙,");
     if(track && !isDuplicate){
       onMusicAdded(track);
     }
  }


    return( 
      <div className="p-6 flex flex-col h-full bg-transparnet">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-foreground">노래 검색하기</h2>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setTab('PLAYLIST')} 
            className="text-muted-foreground hover:text-white"
          >
            ✕
          </Button>
        </div>
    


      <div className="relative mb-8">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value) }
          placeholder="듣고싶은 노래를 추가해주세요."
          className="w-full p-4 bg-secondary text-foreground placeholder:text-muted-foreground rounded-2xl outline-none focus:ring-2 focus:ring-primary transition-all"
        />
        <span className="absolute left-4 top-4 text-gray-400"></span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 pr-2">
        {searchList.map((track) => (
          <div 
            key={track.id} 
           className="flex items-center p-3 rounded-xl hover:bg-white/10 transition-colors group cursor-pointer"
        >
            <img src={track.albumArt} alt={track.name} className="w-12 h-12 rounded-md shadow-md object-cover"/>
            
            <div className="ml-4 flex-1 min-w-0">
             <p className="font-semibold text-foreground truncate">{track.name}</p>
             <p className="text-sm text-muted-foreground truncate">{track.artist}</p>
            </div>

            <button className="opacity-0 group-hover:opacity-100 bg-primary text-black font-bold px-4 py-1.5 rounded-full text-sm transition-all hover:scale-105 active:scale-95"
            onClick={()=> handleAddTrack(track.id,track.name,track.artist,track.albumArt,track.uri)}>
              추가
              </button>
            </div>
        ))}
      </div>
  
      
    </div>
      )

}