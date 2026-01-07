import { useEffect, useState } from "react";
import SearchBar from "./SearchBar";
import { supabase } from "@/lib/supabase";
import PlayList from "./PlayList";
import CurrentTrack from "./CurrentTrack";
import SpotifyPlayer from "./SpotifyPlayer";
import { json } from "stream/consumers";
import { playlistService } from "@/services/playlistService";
import { spotifyService } from "@/services/spotifyService";

export default function MusicSection({roomCode}:{ roomCode: string} ) {
    const [playList,setPlayList]=useState<any[]>([]);
    const [roomId,setRoomId]=useState<string | null> (null);
    const [spotifyToken,setSpotifyToken]=useState("");
    const [isHost,setIsHost]=useState(false);
    const [deviceId,setDeviceId] =useState("");
    const [playingTrack,setPlayingTrack]=useState<any>(null);
        const[isPaused,setIsPaused]=useState(false);


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
        syncPlayBack();
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
     const playTrack = async (trackUri:string) => {
      if(trackUri) return;
      
      spotifyService.play(spotifyToken,deviceId,trackUri);
      setIsPaused(!isPaused);
     }
    
     
     const handleTrackEnd = async (roomId:string) => {

      // 노래 종료시 ,검색후 상태 업데이트
        const currentTrack = await playlistService.getPlayingTrack(roomId);
      if (currentTrack) {
       await playlistService.updateStatus(roomId,currentTrack.id,'finished');
      }
      // 다음 노래 찾아서 틀기
      await syncPlayBack();
     }

    const syncPlayBack = async (newAddTrack?:any) => {
    if(!deviceId) return;
    // 재생 상태 확인
    const currentTrack = await playlistService.getPlayingTrack(roomId);
      if (currentTrack) return;
      // 재생중인곡 없으면 투표수 높은거
      let nextTrack= await playlistService.getTopVotedTrack(roomId);

        if(!nextTrack &&newAddTrack){
          nextTrack=newAddTrack;
        }
      if(nextTrack) {
        await playTrack(nextTrack.track_uri);
        await playlistService.updateStatus(roomId,nextTrack.id,'playing');
        await syncRoomState();
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

  const handlePause = async ()=>{
    console.log("실행 확인")
    await spotifyService.pause(spotifyToken,deviceId);
    setIsPaused(!isPaused);
  }

   return (
    <div>
      <SpotifyPlayer token={spotifyToken} setDeviceId={setDeviceId} onTrackEnd={()=>handleTrackEnd(roomId)}/>
      <SearchBar roomId={roomId} onMusicAdded={handleMusicnAdded}/>
      <CurrentTrack playingTrack={playingTrack} isPaused={isPaused} onPause={handlePause} onPlay={playTrack}/>
      <PlayList playList={playList} />
  
    </div>
  );
}