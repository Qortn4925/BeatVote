import { useEffect, useRef, useState } from "react";
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
import { votesService } from "@/services/votesService";
import { useTabStore ,TabType } from "@/app/store/useTabStore";
import TabContentSection from "@/components/dashboard/TabContentSection";

export default function MusicSection({roomId,userId,nickName,isHost}:{ roomId:string ,userId:string,nickName:string,isHost:boolean} ) {
    const [playList,setPlayList]=useState<any[]>([]);
    const [deviceId,setDeviceId] =useState("");
    const [playingTrack,setPlayingTrack]=useState<any>(null);
    const[isPaused,setIsPaused]=useState(true);
    const [position,setPosition]=useState(0);
    const [duration,setDuration]= useState(0);
    const currentUserId=userId;
    const curretnNickName=nickName;
    const isRoomHost=isHost
    const [myVotes,setMyVotes]= useState<string[]>([]);
    const [displayTrack, setDisplayTrack] = useState<any>(null);

    const activeTab = useTabStore((state) => state.activeTab);

    const playerRef = useRef<any>(null);
        // 노래 재생시키는 함수
        const playTrack = async (trackUri:string) => {
          if(!isRoomHost) return;
          //없어야 종료...
          if(!trackUri) return;
          
          spotifyService.play(deviceId,trackUri);
          
        }
        
        const handleTrackEnd = async (roomId:string) => {
          
          // 노래 종료시 ,검색후 상태 업데이트
          const currentTrack = await playlistService.getPlayingTrack(roomId);
          if (currentTrack) {
          await playlistService.updateStatus(roomId,currentTrack.id,'finished');
          await votesService.deleteVotes(currentTrack.id);
          setMyVotes(prev=>prev.filter(id=>id!==currentTrack.id));
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
            if(isRoomHost){
            await playTrack(nextTrack.tracks.uri);
            await playlistService.updateStatus(roomId,nextTrack.id,'playing');
            const trackInfo = {
                name: nextTrack.tracks.name,
                artist: nextTrack.tracks.artist,
                album_art: nextTrack.tracks.album_art,
                uri: nextTrack.tracks.uri
            };
            await roomService.updateRoomCurrentTrack(roomId,trackInfo);  
          }
          
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


        const handleVoteTrack= async (id:string)=>{
            
          if(myVotes.includes(id)){
            alert("이미 투표한 곡입니다.");
            return ;
          }
            const updatedList=await playlistService.voteTrackAndGetList(id,roomId,currentUserId);
            setPlayList(updatedList);
            setMyVotes(prev=>[...prev,id]);
    
        }
        const getOrCreateGuestId= () =>{
            let guestId=localStorage.getItem('guest_id');
            if(!guestId){
              guestId=`guest_${crypto.randomUUID()}`;
              localStorage.setItem('guest_id',guestId);
            }
            return guestId;
        }
     
        const handlePlayerControl= async()=>{
          const p=playerRef.current;
          
          //비동기 오류...
            setTimeout(async ()=> {
              if(p &&typeof p.togglePlay ==='function'){
                try {
                  await p.togglePlay();
                }catch (e){
                  console.error("재생 제어 실패", e);
                }
              }
            },50);
        }

       const player = useSpotifyPlayer({
       setDeviceId,
       setDuration, 
       setPosition, 
       setIsPaused
   });
        // 실행 순서 보장과 ,렌더링 방지를 위한 useEffect 쪼개기 
        useEffect(()=>{
          if(roomId){
            syncPlayBack();
            syncRoomState();
            // 투표 감지
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
        
          // 2. player가 생성되거나 변경될 때마다 ref에 최신값 복사
          useEffect(() => {
            if (player) {
              playerRef.current = player;
            }
          }, [player]);  
          useEffect(() => {
        //  host가 감지해서 실행하기 위한 useEffect
        if (!isRoomHost) return;

        if (!deviceId) return;

        if (!playingTrack && playList.length > 0) {
          syncPlayBack(); // 아까 막아뒀던 그 함수 실행!
        }

      }, [playList, playingTrack, isRoomHost, deviceId]);
      // ui용  track
      useEffect(() => {
      if (playingTrack) {
        // 노래가 나오고 있으면 -> 화면 정보도 최신화
        setDisplayTrack(playingTrack);
      }
      // else { 노래가 꺼지면? -> 아무것도 안 함 (마지막 정보 유지) }
    }, [playingTrack]);
    return (
    <div className="w-full max-w-md mx-auto p-4">
     
            <TabContentSection
                displayTrack={displayTrack}
                isPaused={isPaused}
                handlePlayerControl={handlePlayerControl}
                duration={duration}
                position={position}
                playList={playList}
                myVotes={myVotes}
                handleVoteTrack={handleVoteTrack}
                roomId={roomId}
                handleMusicAdded={handleMusicAdded}
            />
        </div>
  );
}

