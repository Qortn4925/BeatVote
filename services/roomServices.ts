import { supabase } from "@/lib/supabase";


export const roomService= {

    async getRoomId(roomCode:string){
        const {data,error}=await supabase
        .from('rooms')
        .select('id')
        .eq('room_code',roomCode)
        .single();

        return data?.id;

    }

}