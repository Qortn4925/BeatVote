import { supabase } from "@/lib/supabase";

export const playlistService= {


  async addTrack (params) {
    return await supabase
    .from('playlist')
    .insert(params)
    .select()
    .single();
  },

 async getWaitingTrackList(roomId:string)  {
  const {data,error} =await supabase.from('playlist').select('*').eq('room_id', roomId).order('votes_count',{ascending: false});
    if(error) throw error;
  return data || [];
 },

async getPlayBackContext(roomId:string){
  const {data:playing} = await supabase
  .from('playlist')
  .select('id')
  .eq('room_id',roomId)
  .eq('status','playing')
  .maybeSingle();
  
  return  {isPlaying: !playing};
},

// 곡 상태 업데이트
 async updateStatus(trackId: string, status: 'waiting' | 'playing' | 'finished') {
    const { error } = await supabase
      .from('playlist')
      .update({ status })
      .eq('id', trackId);

    if (error) throw error;
  },
//  투표 1위 곡 가져오기 (다음 곡 선정을 위해)
  async getTopVotedTrack(roomId: string) {
    console.log("실행 확인");
      const {data:nextTrack,error} =await supabase
        .from('playList')
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
  }
};