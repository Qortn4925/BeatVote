import { chatService } from "@/services/chatServices";
import ChatInput from "./ChatInput";
import { roomService } from "@/services/roomServices";
import { useEffect, useState } from "react";
import MessageContainer from "./MessageContainer";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Copy, CopyCheck, UserPlus } from "lucide-react";
import { Popover } from "@radix-ui/react-popover";
import { PopoverContent, PopoverDescription, PopoverHeader, PopoverTitle, PopoverTrigger } from "@/components/ui/popover";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";


export default function ChatSection({roomId,userId,nickName,isHost ,title}:{ roomId:string,userId:string,nickName:string,isHost:boolean , title:string}) {
        
    const[messageList,setMessageList]=useState<any[]>([]);
    const currentUserId=userId;
    const currentNickName=nickName;
    
    const handleSendMessage= async(text:string) =>{
        const now = new Date();
        const tempMessage={
            id:crypto.randomUUID(),
            message:text,
            user_nickname:currentNickName,
            user_id:currentUserId,
            is_host:isHost,
            created_at: now.toISOString()
        }

        chatService.sendMessage(tempMessage.id,text,roomId,currentUserId,nickName,isHost);
        setMessageList((prev:any)=>{
            return [...prev,tempMessage] }
        );
    }

    const getChatMessage =async ()=>{
        const messageList=await chatService.getMessage(roomId);
         setMessageList(messageList);
    }
    useEffect(()=>{
        if(roomId){
        getChatMessage();
        }
        //  중복 데이터 겹치는거 막으려고 데이터 검사
        const channel=chatService.subscribeToChat(roomId,
            (newMessage)=>{
                setMessageList((prev)=>{
                    const isExist=prev.some((m)=>m.id===newMessage.id);
                    if(isExist)return[...prev];

                    return[...prev,newMessage];
                });

         });
   return ()=> {
        if(channel){
             supabase.removeChannel(channel);
        }
        }
    },[roomId])
    
    return (
   <div className="flex flex-col h-full w-full border border-border bg-transparent rounded-lg shadow-sm overflow-hidden">
    <header className="h-14 flex-none border-b border-border flex items-center justify-between px-6 bg-card/50 backdrop-blur-md">
       <span className="font-bold text-foreground">
        {title}
        </span>
        <ShareMenu />
    </header>
     


  <div className="flex-1 overflow-y-auto relative">
    <MessageContainer 
      messageList={messageList} 
      currentUserId={currentUserId}
    />
  </div>

  <div className="flex-none p-3 bg-transparent border-border bg-card ">
    <ChatInput 
      onSendMessage={handleSendMessage} 
      disabled={false}
    />
  </div>

</div>
    );

}

function ShareMenu() {
   const [isCopied,setIsCopied]= useState(false);
   const [inviteLink, setInviteLink] = useState('');
  
    useEffect(() => {
        if (typeof window !== 'undefined') {
        setInviteLink(window.location.href);
        }
    }, []);
        
    const handleCopy = async () => {
        try {
            if (!inviteLink) return;
        await navigator.clipboard.writeText(inviteLink);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000); // 2초 뒤에 원래 아이콘으로 복구
        } catch (err) {
        console.error('복사 실패', err);
        }
    };
    return (
         <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">
            <UserPlus />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start">
        <PopoverHeader>
          <PopoverTitle>친구에게 서버 초대링크 보내기</PopoverTitle>
          <PopoverDescription>
            <InputGroup>
        <InputGroupInput value={inviteLink} readOnly />
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            aria-label="Copy"
            title="Copy"
            size="icon-xs"
            onClick={handleCopy}
          >
            {isCopied ? <CopyCheck/> : <Copy />}
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
          </PopoverDescription>
        </PopoverHeader>
      </PopoverContent>
    </Popover>
    )
}