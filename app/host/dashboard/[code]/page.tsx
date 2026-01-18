'use client';

import { useParams } from "next/navigation";
import ChatSection from "./_components/chat/ChatSection";
import MusicSection from "./_components/music/MusicSection";


export default function VoteRoom() {
    const param= useParams();
    const roomCode= param.code;

    

   return (
    <div className="flex h-full w-full overflow-hidden">
      
      <section className="flex-[6] border-r border-gray-200 bg-white">       
        <ChatSection roomCode={roomCode} />
      </section>

      <section className="flex-[4] bg-gray-50 overflow-y-auto">
        <MusicSection roomCode={roomCode}/>
      </section>

    </div>
  );
}