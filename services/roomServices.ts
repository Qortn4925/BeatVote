import { supabase } from "@/lib/supabase";


export const roomService= {

    async getRoomInfo(roomCode:string){
        const {data,error}=await supabase
        .from('rooms')
        .select('id,host_id,title')
        .eq('room_code',roomCode)
        .single();
        return data;
    },

    // roomlist가져오는 api
     async getRoomList(page:number,query:string='') {
        const limit =8;
        const from=limit*(page-1);
        const to=limit*(page)-1;
       let dbQuery = supabase
        .from('rooms')
        .select('*'); 

    if (query) {
        dbQuery = dbQuery.or(`title.ilike.%${query}%,genre_tag.ilike.%${query}%`);
    }

    const { data, error } = await dbQuery
        .order('created_at', { ascending: false })
        .range(from, to);
    
    if (error) {
        console.error("Room fetch error:", error);
        return [];
    }
    
    return data;
    },
    
    async countMaxPage(query: string = '') {
    // 여기도 동일하게 select -> filter -> count 순서 유지
    let dbQuery = supabase
        .from('rooms')
        .select('*', { count: 'exact', head: true });

    if (query) {
        dbQuery = dbQuery.or(`title.ilike.%${query}%,genre_tag.ilike.%${query}%`);
    }

    const { count, error } = await dbQuery;
    
    if (error) throw error;
    return count;
    }   ,
    async updateRoomCurrentTrack (roomId:string ,track:{}){
         await supabase
         .from('rooms')
         .update({
            current_track:track
         })
         .eq('id',roomId);
    }
}