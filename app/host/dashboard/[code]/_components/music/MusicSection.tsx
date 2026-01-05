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
    const [playingTrack,setPlayingTrack]=useState<any>(null);

    // uuid값 db에서 검색해 state로 관리
    const getRoomUUID= async () => {
      const {data:roomData,error:roomErrot} = await supabase
    .from('rooms')
    .select('id')
    .eq('room_code',roomCode)
    .single();
      if(roomData)  setRoomId(roomData.id);
  }

   
    // 실행 순서 보장과 ,렌더링 방지를 위한 useEffect 쪼개기 
     useEffect(()=> {
      getRoomUUID();
      fetchHostToken();
     },[roomCode])

     useEffect(()=>{
      if(roomId){
       syncRoomState();
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
      console.log("트랙 끝나는거 확인");
      syncPlayBack();
      syncRoomState();
     }

    const syncPlayBack = async (newAddTrack?:any) => {
    if(!deviceId) return;
    // 재생 상태 확인
    const {isPlaying} = await playlistService.getPlayBackContext(roomId);
      if (isPlaying) return;
      
      //이 밑은 곡이 종료가 보장된 시점에 실행
      await playlistService.updateStatus(roomId,'finished');
      // 재생중인곡 없으면 투표수 높은거
      let nextTrack= await playlistService.getTopVotedTrack(roomId);

        if(!nextTrack &&newAddTrack){
          nextTrack=newAddTrack;
        }
      if(nextTrack) {
        await playTrack(spotifyToken,deviceId,nextTrack.track_uri);
        await playlistService.updateStatus(roomId,'playing');
        //  await refreshPlaylist();
      } 
  }

  const handleMusicnAdded = async (newTrack:any) => {
    await syncPlayBack(newTrack);

    await syncRoomState();

  }
  // 방 상태를 결정관리하는 함수
  const syncRoomState= async()=>{
    const [waitingList,playingTrack]= await Promise.all([
      playlistService.getWaitingTrackList(roomId),
      playlistService.getPlayingTrack(roomId)
    ]);
    setPlayingTrack(playingTrack);
    setPlayList(waitingList);
  }

   return (
    <div>
      <SpotifyPlayer token={spotifyToken} setDeviceId={setDeviceId} onTrackEnd={()=>handleTrackEnd(roomId)}/>
      <SearchBar roomId={roomId} onMusicAdded={handleMusicnAdded}/>
      <CurrentTrack playingTrack={playingTrack}/>
      <PlayList playList={playList}/>
  
    </div>
  );
}