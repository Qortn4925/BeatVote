import RoomCard from "./RoomCard";


interface AllListTapProps{
    roomList:any[];
}

export default function AllListTap({roomList }:AllListTapProps){


    // 1. 데이터가 없을 때 (Empty State)
  if (!roomList || roomList.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 opacity-60">
        <div className="w-16 h-16 bg-secondary/50 rounded-full flex items-center justify-center mb-2">
          <span className="text-3xl">🔍</span>
        </div>
        <h3 className="text-xl font-bold text-foreground">방을 찾을 수 없어요</h3>
        <p className="text-sm text-muted-foreground">
          다른 검색어로 찾아보거나, 직접 방을 만들어보세요!
        </p>
      </div>
    );
  }

  // 2. 데이터가 있을 때 (Grid)
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {roomList.map((room) => (
        <RoomCard key={room.id} room={room} />
      ))}
    </div>
  );
}