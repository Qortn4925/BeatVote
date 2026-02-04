import { supabase } from "@/lib/supabase";


export const roomService= {

    async getRoomInfo(roomCode:string){
        const {data,error}=await supabase
        .from('rooms')
        .select('id,host_id')
        .eq('room_code',roomCode)
        .single();
        return data;
    },

    // roomlist가져오는 api
     async getRoomList(page:number) {
        const limit =8;
        const from=limit*(page-1)+1;
        const to=limit*(page);
        const {data:roomList,error}=await supabase
            .from('rooms')
            .select()
            .range(from,to);

            return roomList;
    },
     async countMaxPage(){
    const {count,error}= await supabase
            .from('rooms')
            .select('*', { count: 'exact', head: true });
            
             console.log(count);
             return count;
    } ,
    async updateRoomCurrentTrack (roomId:string ,track:{}){
         await supabase
         .from('rooms')
         .update({
            current_track:track
         })
         .eq('id',roomId);
    }
}