'use client'

import CreateDialogButton from "@/components/dashboard/CreateDialognButton";
import RouteButton from "@/components/dashboard/RouteButton";
import { useRecentRooms } from "@/hooks/useRecentRooms";
import { supabase } from "@/lib/supabase";
import { Clock, Compass, Music } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";



export default function DashboardSidebar(){
    const {recentRooms}=useRecentRooms();
    
    const router = useRouter();
  const createRoom =async(description:string,genre:string,title:string)=>{
        const { data: { user } } = await supabase.auth.getUser();
        if(!user) {
            alert("loginneeds");
            return;
        }
        const roomCode = Math.random().toString(36).substring(2,8).toUpperCase();
        const {data,error} = await supabase
        .from('rooms')
        .insert([
            {
                room_code:roomCode,
                host_id:user.id,
                description:description,
                genre_tag:genre,
                title:title,
            }
        ])
        .select();
        if(error){
            console.error("failed",error.message);
            return;
        }
        if(data) {
          const newRoomCode=data[0].room_code;
            router.push(`/host/dashboard/${newRoomCode}`);
            toast.info("방 생성에 성공하셨습니다.");
        }
    }
  return (
    <aside className="w-[250px] hidden md:flex flex-col gap-2 p-4 pr-0 h-full">
       
       <div className="h-14 flex items-center px-4 bg-card rounded-xl border border-border shrink-0">
          <span className="text-primary font-bold text-xl">BeatVote 🎵</span>
       </div>
       
       <div className="flex-1 bg-card rounded-xl border border-border p-4 shadow-sm flex flex-col gap-4">

        
           <div className="flex-1 overflow-y-auto">
        <h2 className="text-xs font-bold text-zinc-400 mb-2 px-2 flex items-center gap-2">
           <Clock size={12} /> RECENT ROOMS
        </h2>
        
        {recentRooms.length === 0 ? (
          <p className="text-xs text-zinc-600 px-2 mt-2">방문 기록이 없습니다.</p>
        ) : (
          <ul className="space-y-1">
            {recentRooms.map((room) => (
              <li key={room.id}>
                <Link 
                  href={`/host/dashboard/${room.code}`}
                  className="flex items-center gap-3 p-2 rounded-md hover:bg-white/5 text-zinc-400 hover:text-white transition-colors group"
                >
                  {/* 아이콘 박스 */}
                  <div className="w-8 h-8 rounded bg-zinc-800 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Music size={14} />
                  </div>
                  
                  {/* 방 제목 */}
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-sm font-medium truncate">{room.title}</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
        
      </div>
        <CreateDialogButton onCreatRoom={createRoom}/>
        <RouteButton icon={Compass} href="/explore" />
       </div>
      
    </aside>
  );
}


