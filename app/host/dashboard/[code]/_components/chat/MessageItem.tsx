import { UUID } from "crypto";
import { Timestamp } from "next/dist/server/lib/cache-handlers/types";

interface MessageItemProps {
    message:{
        id:UUID,
        is_host:boolean,
        message:string,
        room_id:UUID,
        user_id:string,
        user_nickname:string,
        created_at:Timestamp
    },
    isMine:boolean
}


export default function MessageItem({message, isMine}:MessageItemProps){

  const formatTime=(at:number)=>{
    if(!at) return;
    const date = new Date(at);
    if(isNaN(date.getTime())) return "시간오류";
    return date.toLocaleTimeString('ko-Kr',{ hour: '2-digit', minute: '2-digit' });
  }

    return (<div
            key={message.id}
            className={`flex flex-col ${isMine ? "items-end" : "items-start"}`}
          >
            {/* 닉네임 표시 */}
            <span className="text-xs text-muted-foreground mb-1 px-1">
              {message.user_nickname} {message.is_host && "👑"}
            </span>

            {/* 메시지 말풍선 */}
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm shadow-sm ${
                isMine
                  ? "bg-green-500 text-white rounded-tr-none" 
                  : "bg-white text-slate-800 border rounded-tl-none" 
              }`}
            >
              {message.message}
            </div>
            {/* 시간 표시 (선택사항) */}
            <span className="text-[10px] text-slate-400 mt-1 px-1">
              {formatTime(message.created_at)}
            </span>
          </div>
    );
}