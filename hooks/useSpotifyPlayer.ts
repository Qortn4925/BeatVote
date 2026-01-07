'use clinet';
import { useEffect, useState } from "react";

declare global {
    interface Window {
        onSpotifyWebPlaybackSDKReady: ()=> void;
        Spotify:any;
    }
}


export const useSpotifyPlayer =({token ,setDeviceId,onTrackEnd}:{token:string ,setDeviceId:(deviceId:string)=>void ,onTrackEnd:()=>void})=>{
    const [player, setPlayer] = useState<any>(null);
    const [isPaused, setIsPaused] = useState(true);
  
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
        setIsPaused(state.paused);
        if(state.pasued && state.position === 0 && state.track_window_previous_tracks.length >0){
         console.log("곡이 끝났습니다. 다음곡 호출 로직")
          onTrackEnd();
        }
      });
      newPlayer.connect();
      setPlayer(newPlayer);
    }
       return ()=>{
        if(player) player.disconnect();
       }; 
    },[token]);
    
    return {player};
}

