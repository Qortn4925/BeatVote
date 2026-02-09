
import AllListTap from "@/components/explore/AllListTap";
import RoomPagination from "@/components/explore/Pagination";
import SearchTap from "@/components/explore/SearchTap";
import { roomService } from "@/services/roomServices";


export default async function RoomExplorePage({searchParams}:{searchParams:Promise<{page?:string; query?:string}>;}) {
      const { page, query } = await searchParams;
      const currentPage=Number(page)||1;

      const roomList=await roomService.getRoomList(currentPage,query);
      const totalCount= await roomService.countMaxPage(query);

      const maxPage=Math.ceil((totalCount||0)/8);
      const searchQuery = query || '';

return (
      <div className="min-h-screen w-full bg-background p-4 md:p-8" >
      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        
        <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-border/40 pb-6">
          <div className="space-y-1">
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-foreground">
              Explore <span className="text-primary">.</span>
            </h1>
            <p className="text-muted-foreground text-sm md:text-base">
              새로운 음악 취향을 발견하고 투표에 참여해보세요.
            </p>
          </div>
          
          <div className="w-full md:w-auto">
            <SearchTap />
          </div>
        </div>

        <main className="min-h-[500px]">
           <AllListTap roomList={roomList} />
        </main>

        {/* 5. 페이지네이션 섹션: 하단 여백 추가 */}
        <div className="py-8 border-t border-border/40">
           <RoomPagination page={currentPage} maxPage={maxPage} />
        </div>

      </div>
    </div>
      )

}