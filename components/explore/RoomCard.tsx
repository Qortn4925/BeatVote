'use client';
import { Card, CardHeader, CardTitle } from "../ui/card";
import { useRouter } from "next/navigation";

export default function RoomCard({room}:{room:any}){
    
  const STYLES = {
    card: "hover:shadow-xl transition-all duration-300 bg-zinc-900 border-zinc-800 text-white group",
    title: "text-xl font-bold group-hover:text-green-400 transition-colors",
    description: "text-sm text-zinc-400 mt-2 line-clamp-2",
  };
  
  console.log(room,"room");
const router= useRouter();

  const routeRoom= async(roomCode:string) =>{
    router.push(`/host/dashboard/${roomCode}`);
  }
  
  return (

    <Card className={STYLES.card} onClick={()=>routeRoom(room.room_code)}>
      <CardHeader>
        <CardTitle className={STYLES.title}>{room.title}</CardTitle>
        <p className={STYLES.description}>{room.description}</p>
      </CardHeader>
    </Card>
    
  );
}
