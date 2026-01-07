"use client"
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Pause, Play } from "lucide-react";
import { useState } from "react";


interface CurrentTrackProps {
    isPaused:boolean,
    onPause:()=>void,
    onPlay:(traciUri:string)=>void,
    playingTrack:{
        id:string;
        track_name: string;
        artist_name: string;
        album_art:string;
        track_uri: string;
    }|null;
}

 export  default function CurrentTrack({playingTrack,onPause,isPaused ,onPlay}:CurrentTrackProps) {
        console.log("현재 isPasued",isPaused);
        const handlePlayControl=()=>{
            //정지중일때
            if(isPaused){
                onPlay(playingTrack?.track_uri);
            }
            //실행중일때
            else{
                onPause();
            }
        }
    
    if(!playingTrack) {
        return <div> 재생중인곡 x</div>
    }
    
    return  (<Card className="overflow-hidden border-none bg-gradient-to-br from-secondary/40 to-background shadow-lg">
                <CardContent className="p-4">
                            {/* 앨범 아트 */}
                    <div className="flex flex-col items-center space-y-4">
                        <img src={playingTrack.album_art}/>
                    
                        <div className="w-full text-center">
                            <h2 className="line-clamp-1 text-lg font-bold">{playingTrack.track_name}</h2>
                            <p className="text-sm text-muted-foreground">{playingTrack.artist_name}</p>
                        </div>
                        <div className="w-full space-y-1">
                            <Progress value={33} className="h-1"/>
                            <div className="flex justify-between text-[10px] text-muted-foreground">
                                <span>0:00</span>
                                <span>3:45</span>
                            </div>
                        </div>
                        <Button
                        variant="ghost" 
                        size="icon"
                        className="h-10 w-10 rounded-full hover:scale-105 transition-transform" 
                        onClick={handlePlayControl}> {
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