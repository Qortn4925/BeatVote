'use client';

import CreateDialogButton from "@/components/dashboard/CreateDialognButton";
import { supabase } from "@/lib/supabase";
import { Description } from "@radix-ui/react-dialog";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "sonner";
export default function DashBoardLayout({
    children,
}:{
    children:React.ReactNode
}) {

 const router=useRouter();

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
            toast.info("방 생성에 성공하셨습니다.",{position:"top-center"});
        }
    }

    

   return (
    <div className="flex h-screen w-full bg-gray-50">
      <aside className="w-64 bg-white border-r flex flex-col">
        <div className="p-4 font-bold text-xl border-b">BeatVote</div>
        <div className="flex-1 overflow-y-auto">
          <CreateDialogButton onCreatRoom={createRoom}/>
        </div>
      </aside>

      <main className="flex-1 overflow-hidden">
        {children}
        <Toaster/>
      </main>
    </div>
  );
}