"use client"
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Music, Pause, Play, PlusCircle } from "lucide-react";

interface TrackMaster{
    id:string;
    name:string;
    artist:string;
    album_art:string;
    uri:string;
}

interface CurrentTrackProps {
    isPaused:boolean,
    onTogglePlay:()=>void,
    position:number,
    duration:number,
    displayTrack:{
        id:string;
        room_id:string;
        tracks:TrackMaster;
    }|null;
}

 export  default function CurrentTrack({displayTrack,isPaused ,onTogglePlay ,position,duration}:CurrentTrackProps) {
     
      const formatTime = (ms: number) => {
        const seconds = Math.floor((ms / 1000) % 60);
        const minutes = Math.floor((ms / (1000 * 60)) % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
         };
         const progress=duration>0?(position/duration)*100:0;
  if (!displayTrack) {
    return (
      <Card className="overflow-hidden border border-dashed border-muted-foreground/20 bg-muted/5 shadow-sm">
        <CardContent className="p-8">
          <div className="flex flex-col items-center justify-center space-y-6 opacity-60">
          
            <div className="flex h-40 w-40 items-center justify-center rounded-2xl bg-muted/20 backdrop-blur-sm">
              <Music className="h-16 w-16 text-muted-foreground/40 animate-pulse" />
            </div>

            <div className="w-full text-center space-y-2">
              <h2 className="text-lg font-semibold text-muted-foreground">대기 중인 곡이 없습니다</h2>
              <p className="text-sm text-muted-foreground/70">
                곡 검색 탭에서 노래를 추가하고<br />함께 음악을 즐겨보세요!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
return  (<Card className="overflow-hidden border-none bg-gradient-to-br from-secondary/40 to-background shadow-lg">
                <CardContent className="p-4">
                            {/* 앨범 아트 */}
                    <div className="flex flex-col items-center space-y-4">
                        <img src={displayTrack?.tracks.album_art}/>
                    
                        <div className="w-full text-center">
                            <h2 className="line-clamp-1 text-lg font-bold">{displayTrack?.tracks.name}</h2>
                            <p className="text-sm text-muted-foreground">{displayTrack?.tracks.artist}</p>
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