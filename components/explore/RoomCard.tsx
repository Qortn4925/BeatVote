'use client';
import { Music } from "lucide-react";
import { Card, CardHeader, CardTitle } from "../ui/card";
import { useRouter } from "next/navigation";

export default function RoomCard({room}:{room:any}){
    
  const STYLES = {
    card: "hover:shadow-xl transition-all duration-300 bg-zinc-900 border-zinc-800 text-white group",
    title: "text-xl font-bold group-hover:text-green-400 transition-colors",
    description: "text-sm text-zinc-400 mt-2 line-clamp-2",
  };
  
  console.log(room,"room");
const router= useRouter();

  const routeRoom= async(roomCode:string) =>{
    router.push(`/host/dashboard/${roomCode}`);
  }
  
 const isPlaying = !!room.current_track;

  return (
    <Card
      key={room.room_code}
      onClick={() => routeRoom(room.room_code)}
      className="group relative overflow-hidden border border-white/5 bg-[#181818] hover:bg-[#202020] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer rounded-xl h-full"
    >
      {/* Hover 시 네온 테두리 */}
      <div className="absolute inset-0 border-2 border-primary/0 group-hover:border-primary/50 rounded-xl transition-colors duration-500 pointer-events-none z-30" />

      <div className="p-4 flex flex-col gap-4 h-full">
        
        {/* 1. 메인 비주얼 영역 (앨범 아트 or 플레이스홀더) */}
        <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-black/20 shadow-lg group-hover:shadow-primary/10 transition-shadow">
          {isPlaying ? (
            <>
              {/* 앨범 아트 */}
              <img
                src={room.current_track.album_art}
                alt={room.current_track.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {/* 재생 중 오버레이 (어둡게 + 이퀄라이저) */}
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-end p-3">
                 {/* 🔥 움직이는 이퀄라이저 */}
                 <div className="flex items-end gap-[3px] h-6">
                    <span className="w-1.5 bg-primary rounded-t-sm animate-[music-bar_1s_ease-in-out_infinite]" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 bg-primary rounded-t-sm animate-[music-bar_1s_ease-in-out_infinite]" style={{ animationDelay: '200ms' }} />
                    <span className="w-1.5 bg-primary rounded-t-sm animate-[music-bar_1s_ease-in-out_infinite]" style={{ animationDelay: '400ms' }} />
                    <span className="w-1.5 bg-primary rounded-t-sm animate-[music-bar_1s_ease-in-out_infinite]" style={{ animationDelay: '100ms' }} />
                 </div>
              </div>
            </>
          ) : (
            // 대기 중 플레이스홀더
            <div className="w-full h-full flex flex-col items-center justify-center text-zinc-600 group-hover:text-zinc-500 transition-colors">
              <Music size={48} strokeWidth={1} />
              <p className="text-sm mt-2 font-medium">재생 대기 중</p>
            </div>
          )}
        </div>


        {/* 2. 정보 영역 (통합됨) */}
        <div className="flex flex-col gap-1 min-w-0 flex-1">
          {/* 상단: 방 제목 및 태그 */}
          <div className="flex justify-between items-center gap-2">
            <p className="text-xs font-medium text-zinc-400 truncate group-hover:text-primary/80 transition-colors">
              {room.title}
            </p>
            {room.genre_tag && (
              <span className="shrink-0 text-[10px] font-semibold bg-white/5 text-zinc-400 px-2 py-0.5 rounded-full border border-white/10">
                {room.genre_tag}
              </span>
            )}
          </div>

          {/* 메인: 곡 제목 (가장 크게) */}
          {isPlaying ? (
            <div className="mt-1">
              <h3 className="text-lg font-bold text-white truncate leading-tight group-hover:text-primary transition-colors">
                {room.current_track.name}
              </h3>
              <p className="text-sm text-zinc-400 truncate">
                {room.current_track.artist}
              </p>
            </div>
          ) : (
            <div className="mt-1">
              <h3 className="text-lg font-bold text-zinc-300 truncate leading-tight">
                곡을 추가해주세요
              </h3>
              <p className="text-sm text-zinc-500 truncate">
                함께 듣고 싶은 음악을 투표하세요.
              </p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}