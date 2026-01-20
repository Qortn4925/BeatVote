import { ScrollArea } from "@/components/ui/scroll-area";
import MessageItem from "./MessageItem";
import { useEffect, useRef } from "react";

interface MessageContainerProps{
    messageList:any[];
    currentUserId: string;
}

export default function MessageContainer({messageList}:MessageContainerProps){

    const scrollRef= useRef<HTMLDivElement>(null);
    const currentUserId="hello";

    useEffect(() => {
    // ScrollArea 내부의 실제 스크롤되는 요소(viewport)를 찾아 맨 아래로 내립니다.
    const scrollContainer = scrollRef.current?.querySelector('[data-radix-scroll-area-viewport]');
    if (scrollContainer) {
      scrollContainer.scrollTo({
        top: scrollContainer.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messageList]);

return (
  <ScrollArea ref={scrollRef} className="absolute inset-0 w-full" >
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
    </div>
    </ScrollArea>
  );
}