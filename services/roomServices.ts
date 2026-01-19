import { supabase } from "@/lib/supabase";


export const roomService= {

    async getRoomId(roomCode:string){
        const {data,error}=await supabase
        .from('rooms')
        .select('id')
        .eq('room_code',roomCode)
        .single();
        return data?.id;
    },

    async getRoomList() {
        const {data:roomList,error}=await supabase
            .from('rooms')
            .select()
            .limit(8);

            return roomList;
    },
    async countMaxPage(){
    const {count,error}= await supabase
            .from('rooms')
            .select('*', { count: 'exact', head: true });
            
             console.log(count);
             return count;
    }
}