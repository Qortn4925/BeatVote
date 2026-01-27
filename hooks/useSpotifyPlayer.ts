'use clinet';
import { useEffect, useState } from "react";

declare global {
    interface Window {
        onSpotifyWebPlaybackSDKReady: ()=> void;
        Spotify:any;
    }
}

interface UseSpotifyPlayerProps{
    token:string,
    setPosition:(pos:number)=>void,
    setDuration:(dur:number)=>void,
    setDeviceId:(deviceId:string)=>void,
    setIsPaused:(ispaused:boolean)=>void,
}


export const useSpotifyPlayer =({token ,setDeviceId,setDuration,setPosition,setIsPaused}:UseSpotifyPlayerProps)=>{
    const [player, setPlayer] = useState<any>(null);
  
      useEffect(()=> {
        //1 스크립트 로드
        const script = document.createElement("script");
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;
        document.body.appendChild(script);

       // 2. SDK 로드 완료 시 실행될 콜백 정의
        window.onSpotifyWebPlaybackSDKReady = () => {
          const newPlayer = new window.Spotify.Player({
            name: 'Spotify Player',
            getOAuthToken: (cb: any) => { cb(token); },
            volume: 0.5
          });

          // 2. 에러 핸들링 (재연결 로직 핵심)
        newPlayer.addListener('initialization_error', ({ message }) => console.error(message));
        newPlayer.addListener('authentication_error', ({ message }) => {
          console.error("인증 에러! 토큰 갱신이 필요할 수 있습니다.", message);
        });
        newPlayer.addListener('account_error', ({ message }) => console.error(message));
        
        // 네트워크 유실 등으로 연결 끊겼을 때 감지
        newPlayer.addListener('playback_error', ({ message }) => {
          console.warn("재생 에러 발생, 재연결 시도 중...", message);
          newPlayer.connect(); // 자동 재연결 시도
        });
          
        newPlayer.addListener('ready', ({ device_id }:any) => {
            setDeviceId(device_id); 
          fetch('https://api.spotify.com/v1/me/player', {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              device_ids: [device_id],
              play: false, 
            }),
          });
        });


      // 기기 준비
      newPlayer.addListener('player_state_changed',(state:any)=> {
        if(!state) return;
        setIsPaused(!!state.paused);
        setPosition(state.position);
        setDuration(state.duration);
      });
      newPlayer.connect();
      setPlayer(newPlayer);
    }
       return ()=>{
        if(player) player.disconnect();
       }; 
    },[token]);
    
    return player;
}

