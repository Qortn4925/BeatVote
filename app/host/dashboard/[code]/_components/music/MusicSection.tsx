import { useEffect, useState } from "react";
import SearchBar from "./SearchBar";
import { supabase } from "@/lib/supabase";
import PlayList from "./PlayList";
import CurrentTrack from "./CurrentTrack";
import SpotifyPlayer from "./SpotifyPlayer";
import { json } from "stream/consumers";
import { playlistService } from "@/services/playlistService";

export default function MusicSection({roomCode}:{ roomCode: string} ) {
    const [playList,setPlayList]=useState<any[]>([]);
    const [roomId,setRoomId]=useState<string | null> (null);
    const [spotifyToken,setSpotifyToken]=useState("");
    const [isHost,setIsHost]=useState(false);
    const [deviceId,setDeviceId] =useState("");
    // uuid값 db에서 검색해 state로 관리
    const getRoomUUID= async () => {
      const {data:roomData,error:roomErrot} = await supabase
    .from('rooms')
    .select('id')
    .eq('room_code',roomCode)
    .single();
      if(roomData)  setRoomId(roomData.id);
  }

    // PlayList 테이블에서 정보 받아오기
     const refreshPlaylist =  async () => { 
         const {data} =await supabase.from('playlist').select('*').eq('room_id', roomId).order('votes_count',{ascending: false});
         if(data) setPlayList(data);
         console.log(data,"data");
     };
    // 실행 순서 보장과 ,렌더링 방지를 위한 useEffect 쪼개기 
     useEffect(()=> {
      getRoomUUID();
      fetchHostToken();
     },[roomCode])

     useEffect(()=>{
      if(roomId){
        refreshPlaylist();
      }
     },[roomId])
     
     const fetchHostToken=async()=>{
      const {data:{session}} = await supabase.auth.getSession();
      if(session?.provider_token){
        setSpotifyToken(session.provider_token);
        setIsHost(true);
      }
     }


     // 노래 재생시키는 함수
     const playTrack = async (spotifyToken,deviceId,trackUri) => {
      try {
        const response = await fetch (
          `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,{
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${spotifyToken}`,
            },
            body:JSON.stringify({
              uris:[trackUri]
            }),
          }
        );
        if(response.ok) {
          console.log("새 노래 재생 시작");
        }else {
          const errorData= await response.json();
          console.error("재생 실패 원인" ,errorData);
        }
      }catch (error) {
        console.error("네트워크 에러",error);
      }
     }
     const handleTrackEnd = async (roomId:string) => {
      try{
          const nextTrack =await playlistService.getTopVotedTrack(roomId);
          console.log(nextTrack,"값 확인")
          if(nextTrack){
            // await playTrack(spotifyToken,deviceId,)
          }
        }catch(error) {
          console.log(error);
        }
     }


   return (
    <div>
      <SpotifyPlayer token={spotifyToken} setDeviceId={setDeviceId} onTrackEnd={()=>handleTrackEnd(roomId)}/>
      <SearchBar roomId={roomId} onMusicAdded={refreshPlaylist}/>
      <CurrentTrack/>
      <PlayList playList={playList}/>
  
    </div>
  );
}