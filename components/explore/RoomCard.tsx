import { Card, CardHeader, CardTitle } from "../ui/card";


export default function RoomCard({room}:{room:any}){
    
  const STYLES = {
    card: "hover:shadow-xl transition-all duration-300 bg-zinc-900 border-zinc-800 text-white group",
    title: "text-xl font-bold group-hover:text-green-400 transition-colors",
    description: "text-sm text-zinc-400 mt-2 line-clamp-2",
  };
  console.log(room,"room");
  return (

    <Card className={STYLES.card}>
      <CardHeader>
        <CardTitle className={STYLES.title}>1</CardTitle>
        <p className={STYLES.description}>2</p>
      </CardHeader>
    </Card>
    
  );
}
