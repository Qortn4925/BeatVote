import RoomCard from "./RoomCard";


interface AllListTapProps{
    roomList:any[];
}

export default function AllListTap({roomList }:AllListTapProps){


    return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {roomList.map((room) => (
    <RoomCard key={room.id} room={room} />
  ))}
</div>
         
   

}