import { useEffect, useState } from "react";
import SearchBar from "./SearchBar";
import { supabase } from "@/lib/supabase";
import PlayList from "./PlayList";
import CurrentTrack from "./CurrentTrack";
import { playlistService } from "@/services/playlistService";
import { spotifyService } from "@/services/spotifyService";
import { useSpotifyPlayer } from "@/hooks/useSpotifyPlayer";
import { roomService } from "@/services/roomServices";
import { Button } from "@/components/ui/button";
import { UUID } from "crypto";

export default function MusicSection({roomCode}:{ roomCode: string} ) {
    const [playList,setPlayList]=useState<any[]>([]);
    const [roomId,setRoomId]=useState<string | null> (null);
    const [spotifyToken,setSpotifyToken]=useState("");
    const [isHost,setIsHost]=useState(false);
    const [deviceId,setDeviceId] =useState("");
    const [playingTrack,setPlayingTrack]=useState<any>(null);
    const[isPaused,setIsPaused]=useState(true);
    const [position,setPosition]=useState(0);
    const [duration,setDuration]= useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
     
        const getRoomId= async () => {
        const roomId= await roomService.getRoomId(roomCode);
          if(roomId)  setRoomId(roomId);
       }


        const fetchHostToken=async()=>{
          const {data:{session}} = await supabase.auth.getSession();
          if(session?.provider_token){
            setSpotifyToken(session.provider_token);
            setIsHost(true);
          }
        }

        // 노래 재생시키는 함수
        const playTrack = async (trackUri:string) => {
          //없어야 종료...
          if(!trackUri) return;
          
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

          // 재생 상태
           setIsPaused(!isPaused); 
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
       // 음악 추가시 
        const handleMusicAdded = async (newTrack:any) => {
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
        player.pause();
        // await spotifyService.pause(spotifyToken,deviceId);
        setIsPaused(!isPaused);
        }

        const handleResume= ()=>{
          if(player) {
            player.resume();
            setIsPaused(!isPaused);
          }
        }
        const handleVoteTrack= async (id:UUID)=>{
        
            const updatedList=await playlistService.voteTrackAndGetList(id,roomId);
            setPlayList(updatedList);
          
        }

        const {player,isPlayerPaused} = useSpotifyPlayer({token:spotifyToken,setDeviceId,setPosition,setDuration,onTrackEnd:()=>handleTrackEnd(roomId)});
    // 실행 순서 보장과 ,렌더링 방지를 위한 useEffect 쪼개기 
     useEffect(()=> {
      getRoomId();
      fetchHostToken();
     },[roomCode])

     useEffect(()=>{
      if(roomId){
        syncPlayBack();
        syncRoomState();
        const channel = playlistService.subscribeToPlaylist(roomId,syncRoomState);
        
        return ()=> {
          supabase.removeChannel(channel);
        }
      }
     },[roomId])
    
     // 타이머
     useEffect(()=>{
      let timer:NodeJS.Timeout;
      if(!isPaused &&player){


        timer=setInterval(()=>{
          setPosition((prev)=>{
          const currentPos=prev+1000;
         
             if(duration>0 && (duration-currentPos)<1500){
              console.log("노래 끝나는거 감지 함수.");
              handleTrackEnd(roomId);
              clearInterval(timer);
             }
             return currentPos;
        });
        },1000);
      }
      return () =>{
        if(timer) clearInterval(timer);
      }
     },[isPaused,player,duration]);
     
   return (
    <div>
      <Button onClick={()=>{setPosition(duration-5000)}}> 노래 종료</Button>
      <SearchBar roomId={roomId} onMusicAdded={handleMusicAdded}/>
      <CurrentTrack playingTrack={playingTrack} isPaused={isPaused} onPause={handlePause} onPlay={playTrack} onResume={handleResume} duration={duration} position={position}/>
      <PlayList playList={playList}  onVoted={handleVoteTrack}/>
    </div>
  );
}