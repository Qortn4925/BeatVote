import { chatService } from "@/services/chatServices";
import ChatInput from "./ChatInput";
import { roomService } from "@/services/roomServices";
import { useEffect, useState } from "react";
import { useUserIdentifier } from "@/hooks/useUserIdentifer";
import MessageContainer from "./MessageContainer";
import { supabase } from "@/lib/supabase";
import { ScrollArea } from "@radix-ui/react-scroll-area";



export default function ChatSection({roomCode}:{ roomCode: string}) {
        
    const[roomId,setRoomId]=useState();
    const[messageList,setMessageList]=useState<any[]>([]);
    const { userId, isAnonymous } = useUserIdentifier();
    
    const handlSendMessage= async(text:string) =>{
        const nickName= '안녕';
        
        const tempMessage={
            id:crypto.randomUUID(),
            message:text,
            user_nickanme:nickName,
            user_id:userId,
            is_host:true,
            created_at:new Date().toISOString
        }

        chatService.sendMessage(tempMessage.id,text,roomId,userId,nickName);
        setMessageList((prev:any)=>{
            return [...prev,tempMessage] }
        );
    }
    const fetchData= async()=>{
         const roomId= await roomService.getRoomId(roomCode);
          if(roomId)  setRoomId(roomId);
    }
    const getChatMessage =async ()=>{
        const messageList=await chatService.getMessage(roomId);
         setMessageList(messageList);
    }
    useEffect(()=>{
        fetchData();
    },[roomCode])

    useEffect(()=>{
        if(roomId){
        getChatMessage();
        }
        //  중복 데이터 겹치는거 막으려고 데이터 검사
        const channel=chatService.subscribeToChat(roomId,
            (newMessage)=>{
                setMessageList((prev)=>{
                    const isExist=prev.some((m)=>m.id===newMessage.id);
                    if(isExist)return[...prev];

                    return[...prev,newMessage];
                });

         });
   return ()=> {

        if(channel){
             supabase.removeChannel(channel);

        }

        }
    },[roomId])
    
    return (
    <div className="flex flex-col h-[600px] border bg-white rounded-lg overflow-hidden">
        {/* 헤더: 딱 자기 높이만 차지 (flex-none) */}
        <div className="flex-none h-12 border-b flex items-center px-4 bg-slate-50">방 제목</div>

        {/* 🚀 메시지 영역 감옥: 여기서 flex-1과 min-h-0이 자식을 꽉 잡아야 함 */}
        <div className="flex-1 min-h-0 w-full relative overflow-hidden">
            <MessageContainer messageList={messageList} />
        </div>

        {/* 입력창: 바닥 고정 (flex-none) */}
        <div className="flex-none p-4">
        <ChatInput onSendMessage={handlSendMessage} disabled={false}/>
        </div>
    </div>
    );

}