"use client"
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Pause, Play } from "lucide-react";

interface TrackMaster{
    id:string;
    name:string;
    artist:string;
    album_art:string;
    uri:string;
}

interface CurrentTrackProps {
    isPaused:boolean,
    onPause:()=>void,
    onPlay:(traciUri:string)=>void,
    onResume:()=>void,
    onTogglePlay:()=>void,
    position:number,
    duration:number,
    playingTrack:{
        id:string;
        room_id:string;
        tracks:TrackMaster;
    }|null;
}

 export  default function CurrentTrack({playingTrack,onPause,isPaused ,onTogglePlay ,onPlay,onResume,position,duration}:CurrentTrackProps) {
        // const handlePlayControl=()=>{
        //     //정지중일때
        //     if(isPaused){
        //         onResume();
        //     }
        //     //실행중일때
        //     else{
        //         onPause();
        //     }
        // }
      const formatTime = (ms: number) => {
        const seconds = Math.floor((ms / 1000) % 60);
        const minutes = Math.floor((ms / (1000 * 60)) % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
         };

         const progress=duration>0?(position/duration)*100:0;

    if(!playingTrack) {
        return <div> 재생중인곡 x</div>
    }
  
    
    return  (<Card className="overflow-hidden border-none bg-gradient-to-br from-secondary/40 to-background shadow-lg">
                <CardContent className="p-4">
                            {/* 앨범 아트 */}
                    <div className="flex flex-col items-center space-y-4">
                        <img src={playingTrack.tracks.album_art}/>
                    
                        <div className="w-full text-center">
                            <h2 className="line-clamp-1 text-lg font-bold">{playingTrack.tracks.name}</h2>
                            <p className="text-sm text-muted-foreground">{playingTrack.tracks.artist}</p>
                        </div>
                        <div className="w-full space-y-1">
                            <Progress value={progress} className="h-1"/>
                            <div className="flex justify-between text-[10px] text-muted-foreground">
                                <span>{formatTime(position)}</span>
                                <span>{formatTime(duration)}</span>
                            </div>
                        </div>
                        <Button
                        variant="ghost" 
                        size="icon"
                        className="h-10 w-10 rounded-full hover:scale-105 transition-transform" 
                        onClick={onTogglePlay}> {
                            isPaused? (
                              <Play className="h-6 w-6 fill-current ml-1" />
                            ):(
                                <Pause className="h-6 w-6 fill-current" />
                            )
                            }</Button>
                        </div>

                </CardContent>
                </Card>
        
         )
}