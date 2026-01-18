import { supabase } from "@/lib/supabase";
import { UUID } from "crypto";



export const chatService={

    async sendMessage (text:string,roomId:string,myNickname:string){
    
        const { error } = await supabase
        .from('chat_messages')
        .insert([{ 
            message: text, 
            room_id: roomId,
            user_id:  
            user_nickname: myNickname 
        }]);

    }
}