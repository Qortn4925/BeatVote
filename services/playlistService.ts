import { supabase } from "@/lib/supabase";
import { UUID } from "crypto";

export const playlistService= {


  async addTrack (roomId:string,trackId:string,trackName:string,artist:string,albumArt:string,trackUri:string) {
      const {data,error} = await supabase.from('playlist').
            insert({
            room_id:roomId,
            track_id:trackId,
            track_name:trackName,
            artist_name:artist,
            album_art:albumArt,
            track_uri:trackUri,
              }).select()
              .single();

              if(error) {
                console.error("곡 추가중 에러", error.message);
              }

              return data;
  },

 async getWaitingTrackList(roomId:string)  {
  const {data,error} =await supabase.from('playlist').select('*').eq('room_id', roomId).eq('status','waiting').order('votes_count',{ascending: false});
    if(error) throw error;
  return data || [];
 },

 async getPlayingTrack(roomId:string){
      const{data,error} =await supabase.from('playlist').select('*').eq('room_id',roomId).eq('status','playing').maybeSingle();

    if (error) {
      console.error("재생 곡 조회 중 에러:", error.message);
      return null;
    }

    return data;
 },


// 곡 상태 업데이트
 async updateStatus(roomId: string,id:UUID, status: 'waiting' | 'playing' | 'finished') {
  console.log("이거 실행여부 확인");
    const { error } = await supabase
      .from('playlist')
      .update({ status:status })
      .eq('room_id',roomId)
      .eq('id',id);

    if (error) {
      console.error("업데이트 오류 ㅜ ㅜ ",  error.message);
    };
    
  },
//  투표 1위 곡 가져오기 (다음 곡 선정을 위해)
  async getTopVotedTrack(roomId: string) {
    console.log("실행 확인");
      const {data:nextTrack,error} =await supabase
        .from('playlist')
        .select('*')
        .eq('room_id',roomId)
        .eq('status','waiting')
        .order('votes_count',{ascending:false})
        .limit(1)
        .maybeSingle();
        if(error || !nextTrack){
          console.log("대기열에 다음 곡이 없습니다.");
          return;
        }
        console.log(nextTrack,"nextTrack");
    return nextTrack;
  },

  async updateVotedTrack(id:UUID){
     const {error}= await supabase.rpc('increment_vote',{
      playlist_id:id
     })

     if(error) {console.log(error.message,"곡 업데이트 오류")
      return error;
     };
     
  }
};