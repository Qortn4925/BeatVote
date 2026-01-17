import { supabase } from "@/lib/supabase"


export const votesService= {

    async deleteVotes(playlistId:string){
        await supabase.from('votes').delete().eq('playlist_id',playlistId);
    }

}