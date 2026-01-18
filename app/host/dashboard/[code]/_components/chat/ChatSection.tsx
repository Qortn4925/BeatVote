import { chatService } from "@/services/chatServices";
import ChatInput from "./ChatInput";
import { roomService } from "@/services/roomServices";
import { useEffect, useState } from "react";



export default function ChatSection({roomCode}:{ roomCode: string}) {
        
    const[roomId,setRoomId]=useState('');
    const handlSendMessage= async(text:string) =>{
        const nickName= '안녕';
        chatService.sendMessage(text,roomId,nickName);
    }

    const fetchDate= async()=>{
         const roomId= await roomService.getRoomId(roomCode);
          if(roomId)  setRoomId(roomId);
          
    }
    useEffect(()=>{
        fetchDate();
        
    },[roomCode])

    return  <div> chat +{roomCode} 
        <ChatInput onSendMessage={handlSendMessage} disabled={false}/>
    </div>

}