'use client'; 

import { useEffect, useState } from "react";
import { spotifyService } from "@/services/spotifyService";
import { spotifyTokenManager } from "@/lib/spotify/spotifyTokenManager";

declare global {
    interface Window {
        onSpotifyWebPlaybackSDKReady: () => void;
        Spotify: any;
    }
}

interface UseSpotifyPlayerProps {
    setPosition: (pos: number) => void;
    setDuration: (dur: number) => void;
    setDeviceId: (deviceId: string) => void;
    setIsPaused: (ispaused: boolean) => void;
}

export const useSpotifyPlayer = ({ setDeviceId, setDuration, setPosition, setIsPaused }: UseSpotifyPlayerProps) => {
    const [player, setPlayer] = useState<any>(null);

    useEffect(() => {
        // 1. 스크립트 로드 (중복 로드 방지)
        if (!document.getElementById("spotify-player-script")) {
            const script = document.createElement("script");
            script.id = "spotify-player-script";
            script.src = "https://sdk.scdn.co/spotify-player.js";
            script.async = true;
            document.body.appendChild(script);
        }

        // 2. SDK 로드 완료 시 실행
        window.onSpotifyWebPlaybackSDKReady = () => {
            const newPlayer = new window.Spotify.Player({
                name: 'BeatVote Web Player',
                // 토큰을 Props가 아닌 매니저에게 요청
                getOAuthToken: async (cb: (token: string) => void) => {
                    const token = await spotifyTokenManager.getToken();
                    cb(token);
                },
                volume: 0.5
            });

            // 에러 핸들링
            newPlayer.addListener('initialization_error', ({ message }: any) => console.error(message));
            newPlayer.addListener('authentication_error', ({ message }: any) => {
                console.error("인증 에러! 토큰 매니저가 곧 갱신을 시도할 것입니다.", message);
            });
            newPlayer.addListener('account_error', ({ message }: any) => console.error(message));

            newPlayer.addListener('playback_error', ({ message }: any) => {
                console.warn("재생 에러, 재연결 시도...", message);
            });

            // -> 서비스 이용
            newPlayer.addListener('ready', async ({ device_id }: any) => {
                console.log('Ready with Device ID', device_id);
                setDeviceId(device_id);
                try {
                    await spotifyService.transferPlayback(device_id);
                } catch (e) {
                    console.error("기기 전환 실패:", e);
                }
            });

            newPlayer.addListener('player_state_changed', (state: any) => {
                if (!state) return;
                setIsPaused(state.paused);
                setPosition(state.position);
                setDuration(state.duration);
            });

            newPlayer.connect();
            setPlayer(newPlayer);
        };

        // 클린업
        return () => {
            if (player) player.disconnect();
        };
    }, []); 

    return player;
};