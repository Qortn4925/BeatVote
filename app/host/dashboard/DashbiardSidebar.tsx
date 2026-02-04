'use client'

import CreateDialogButton from "@/components/dashboard/CreateDialognButton";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { toast } from "sonner";



export default function DashboardSidebar(){
    
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
       {/* 로고 */}
       <div className="h-14 flex items-center px-4 bg-card rounded-xl border border-border shrink-0">
          <span className="text-primary font-bold text-xl">BeatVote 🎵</span>
       </div>
       
       {/* 메뉴 리스트 */}
       <div className="flex-1 bg-card rounded-xl border border-border p-4 shadow-sm flex flex-col gap-4">
          <div className="text-xs font-bold text-muted-foreground ml-1">CONTROLS</div>
          <CreateDialogButton onCreatRoom={createRoom}/>
       </div>
    </aside>
  );
}


