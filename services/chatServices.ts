import { supabase } from "@/lib/supabase";
import { UUID } from "crypto";



export const chatService={

    async sendMessage (id:string,text:string,roomId:string,userId:string,myNickname:string ,isHost:boolean){
    
        const { data:message,error } = await supabase
        .from('chat_messages')
        .insert([{ 
            id:id,
            message: text, 
            room_id: roomId,
            user_id: userId, 
            user_nickname: myNickname ,
            is_host:isHost
        }])
        .select();
        return message;

    },

    async getMessage(roomId:string){
        const {data:messageList,error} =await supabase
        .from('chat_messages')
        .select('*')
        .eq('room_id',roomId)
        .order('created_at', { ascending: true });
        if(error){
            console.error(error,"메시지 조회 api 에러");
            return [];
        }
        return messageList;
        
    },

     subscribeToChat (roomId:string,onUpdate:(newMessage:any)=>void) {
        return supabase
       .channel(`chats-${roomId}`)
            .on(
            'postgres_changes',
            {
                event:'*',
                schema:'public',
                table:'chat_messages',
                filter:`room_id=eq.${roomId}`
            },
            (payload)=>{
                onUpdate(payload.new);
            }
            )
            .subscribe((status)=>{
                console.log("현재 구독 상태",status);
               if (status === 'CHANNEL_ERROR') {
                    console.error("❌ 구독 에러 발생! RLS 정책이나 프로젝트 설정을 확인하세요.");
                }
            });
    }
}