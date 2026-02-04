import { ScrollArea } from "@/components/ui/scroll-area";
import MessageItem from "./MessageItem";
import { useEffect, useRef } from "react";

interface MessageContainerProps{
    messageList:any[];
    currentUserId: string;
}

export default function MessageContainer({messageList,currentUserId}:MessageContainerProps){

  const messagesEndRef = useRef<HTMLDivElement>(null);
  // 2. 스크롤 내리는 함수
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  
  useEffect(() => {
    scrollToBottom();
  }, [messageList]); 
return (

    <div className="flex flex-col space-y-4">
      {messageList?.length === 0 && (
        <div className="text-center text-muted-foreground py-10">
          첫 번째 메시지를 보내보세요! 🎵
    </div>
      )}

      {messageList?.map((item,index) => {
        const isMine = item.user_id === currentUserId;
        return (
          <MessageItem key={`${item.id}-${index}`} message={item} isMine={isMine}/>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
    
  );
}