import { supabase } from "@/lib/supabase";
import { UUID } from "crypto";
import { subscribe } from "diagnostics_channel";

export const playlistService= {


  async addTrack (roomId:string,trackId:string,trackName:string,artist:string,albumArt:string,trackUri:string) {
        // 1.노래 추가시 마스터 테이블에 등록되어있는지 확인.
        const {error:trackError} =await supabase
            .from('tracks')
            .upsert({
              id:trackId,
              name:trackName,
              artist:artist,
              album_art:albumArt,
              uri:trackUri
            });

            if(trackError) throw trackError;
            
            // 2. 현재 방에 'waiting', 또는 'playing' 중인지 확인
            const {data:existing} = await supabase
            .from('playlist')
            .select('id')
            .eq('room_id',roomId)
            .eq('track_id',trackId)
            .in('status',['waiting','playing'])
            .maybeSingle();
            if(existing) return {isDuplicate:true};
            //3. playlist 데이터 넣기.
            const {data:track,error} =await supabase
            .from('playlist').
            insert({
            room_id:roomId,
            track_id:trackId,
              }).select(`
                *,
                tracks(*)
                `)
              .single();
              if(error) {
                console.error("곡 추가중 에러", error.message);
                throw error;
              }
              return {track,isDuplicate:false};
  },

 async getWaitingTrackList(roomId:string)  {
  const {data,error} =await supabase
        .from('playlist')
        .select(`*,
          tracks(
          name,
          artist,
          album_art,
          uri
          )
        `)
        .eq('room_id', roomId)
        .eq('status','waiting')
        .order('votes_count',{ascending: false});
    if(error) throw error;
  return data || [];
 },

 async getPlayingTrack(roomId:string){
      const{data,error} =await supabase
          .from('playlist')
          .select(`*,
            tracks (
            name,
            artist,
            album_art,
            uri)
            `)
          .eq('room_id',roomId)
          .eq('status','playing')
          .maybeSingle();

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
        .select(`*,
           tracks (
            name,
            artist,
            album_art,
            uri)
            `)
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

  // 투표 후 tracklist 재반환.
  async voteTrackAndGetList(id:UUID ,roomId:UUID , userId:UUID){
     const {data,error}= await supabase.rpc('handle_track_vote',{
      p_playlist_id:id,
      p_room_id:roomId,
      p_user_id:userId
     })
     console.log(data,"곡 추가시 데이터 값");
     if(error) {console.log(error.message,"곡 업데이트 오류")
      return error;
     };

     return data;
     
  },

  async subscribeToPlaylist(roomId:UUID, onUpdate:()=>void){
    return supabase
    .channel(`room-${roomId}`)
    .on(
      'postgres_changes',
      {
        event:'*',
        schema:'public',
        table:'playlist',
        filter:`room_id=eq.${roomId}`
      },
      ()=>{
        onUpdate();
      }
    )
    .subscribe();
  }
};