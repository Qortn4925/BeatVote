'use client';

import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
export default function DashBoardLayout({
    children,
}:{
    children:React.ReactNode
}) {

 const router=useRouter();

    const createRoom =async()=>{
        const { data: { user } } = await supabase.auth.getUser();
        if(!user) {
            alert("loginneeds");
            return;
        }
        const roomCode = Math.random().toString(36).substring(2,8).toUpperCase();
        // supabase ����옣
        const {data,error} = await supabase
        .from('rooms')
        .insert([
            {
                room_code:roomCode,
                host_id:user.id
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
        }
    }

   return (
    <div className="flex h-screen w-full bg-gray-50">
      <aside className="w-64 bg-white border-r flex flex-col">
        <div className="p-4 font-bold text-xl border-b">BeatVote</div>
        <div className="flex-1 overflow-y-auto">
          <button className="w-full p-4 text-left hover:bg-gray-100" onClick={createRoom}>+ 방 만들기</button>
        </div>
      </aside>

      <main className="flex-1 overflow-hidden">
        {children}
      </main>
    </div>
  );
}