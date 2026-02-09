import { ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { useTabStore } from "@/app/store/useTabStore";


interface PlayListProps {
  playList: any[]; 
  myVotes: string[];
  onVoted: (trackId: string) => void;
}

export default function PlayList({playList,myVotes , onVoted}:PlayListProps) {


    return <div className="flex flex-col h-full space-y-4">
    
      <PlayListHeader count={playList.length}/>

      <ScrollArea className="flex-1 pr-4">
        <div className="space-y-3">
          {playList.map((track, index) => (
            <PlayListItem
              key={track.id}
              track={track}
              index={index}
              isVoted={myVotes.includes(track.id)}
              onVoted={onVoted}
              />
          ))}
        </div>
      </ScrollArea>
    </div>
}

function PlayListHeader({count}:{count:number}) {
  const setTab=useTabStore((state)=>state.setTab);
  return (
    <div className="flex items-center justify-between px-2 mb-4">
      <div className="flex items-center gap-2">
        <h3 className="text-sm font-semibold text-muted-foreground">투표 리스트</h3>
        <Badge variant="secondary">{count} Tracks</Badge>
      </div>
    </div>
  );
};

interface ItemProps{
  track:any;
  index: number;
  isVoted:boolean;
  onVoted:(id:string)=>void;
}
function PlayListItem ( {track ,index,isVoted,onVoted}:ItemProps){

  return  (
            <Card key={track.id} className="overflow-hidden border-none bg-secondary/30">
              <CardContent className="p-3 flex items-center gap-4">
                {/* 순위 표시 */}
                <span className="text-xs font-bold text-muted-foreground w-4">
                  {index + 1}
                </span>

                {/* 앨범 아트 */}
                <img 
                  src={track.tracks.album_art} 
                  alt={track.tracks.name} 
                  className="w-12 h-12 rounded-md object-cover shadow-sm"
                />

                {/* 곡 정보 */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{track.tracks.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{track.tracks.artist}</p>
                </div>

                {/* 투표 섹션 */}
                <div className="flex flex-col items-center gap-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 hover:bg-primary/20 hover:text-primary"
                    disabled={isVoted}
                    onClick={()=>onVoted(track.id)}
                  >
                    <ChevronUp className="h-5 w-5" />
                  </Button>
                  <span className="text-xs font-bold">{track.votes_count}</span>
                </div>
              </CardContent>
            </Card>
          )
}
