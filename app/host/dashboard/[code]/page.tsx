'use client';

import { useParams, useRouter } from "next/navigation";
import ChatSection from "./_components/chat/ChatSection";
import MusicSection from "./_components/music/MusicSection";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { getGuestInfo } from "@/lib/guestUtils";
import { roomService } from "@/services/roomServices";


export default function VoteRoom() {
    const param= useParams();
    const roomCode= param.code;
    const router = useRouter();
    const [isLoading,setIsLoading]=useState(true);

   const [userIdentity, setUserIdentity] = useState<{
    id: string;
    name: string;
    isHost: boolean;
  } | null>(null);
  const [roomData, setRoomData] = useState<{ id: string; host_id: string } | null>(null);
    useEffect(()=>{
      const initializeRoom = async () => {
      try {
        if (!roomCode) return;

        // [A] 방 정보 가져오기 (API 호출)
        const roomInfo = await roomService.getRoomInfo(roomCode as string);
        
        if (!roomInfo) {
          alert("존재하지 않는 방입니다.");
          router.push('/'); // 메인으로 튕겨내기
          return;
        }

        // [B] 내 신원 확인 (Supabase or Guest)
        let myId = '';
        let myName = '';
        
        const { data: { session } } = await supabase.auth.getSession();

        if (session?.user) {
          // 회원
          myId = session.user.id;
          myName = session.user.user_metadata.full_name || '회원님';
        } else {
          // 비회원 (게스트)
          const guest = getGuestInfo();
          if (guest) {
            myId = guest.id;
            myName = guest.name;
          }
        }

        
        // 내 Id 와 방 host_id 비교.
        const isHostUser = myId === roomInfo.host_id;

        setRoomData(roomInfo); // 방 정보 저장 (id, host_id 등)
        setUserIdentity({
          id: myId,
          name: myName,
          isHost: isHostUser, // ✅ 여기서 정확하게 판별됨
        });

      } catch (error) {
        console.error("방 입장 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeRoom();
    
  }, []); 
  
// 로딩 처리
  if (isLoading || !userIdentity || !roomData) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="animate-pulse text-gray-500">입장 중입니다...</div>
      </div>
    );
  }
   return (
    <div className="flex h-full w-full gap-4 p-4">
      
     <section className="flex-1 flex flex-col bg-card rounded-xl border border-border shadow-xl overflow-hidden">
        <ChatSection roomId={roomData.id}  userId={userIdentity.id} nickName={userIdentity.name} isHost={userIdentity.isHost}/>
      </section>

     <aside className="w-[400px] flex flex-col bg-card rounded-xl border border-border shadow-xl overflow-hidden">
        <MusicSection roomId={roomData.id} userId={userIdentity.id} nickName={userIdentity.name} isHost={userIdentity.isHost} />
     </aside>

    </div>
  );
}