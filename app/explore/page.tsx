
import AllListTap from "@/components/explore/AllListTap";
import RoomPagination from "@/components/explore/Pagination";
import SearchTap from "@/components/explore/SearchTap";
import { roomService } from "@/services/roomServices";


export default async function RoomExplorePage({searchParams}:{searchParams:Promise<{page?:string}>}) {
      const {page}=await searchParams;
      const currentPage=Number(page)||1;

      const roomList=await roomService.getRoomList(currentPage);
      const totalCount= await roomService.countMaxPage();

      const maxPage=Math.ceil((totalCount||0)/8);


return (
      <div> 
      <SearchTap/>
      <AllListTap roomList={roomList}/>
      <RoomPagination page={currentPage} maxPage={maxPage}/>
      </div>
      )

}