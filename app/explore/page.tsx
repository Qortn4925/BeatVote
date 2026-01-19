'use client';
import AllListTap from "@/components/explore/AllListTap";
import RoomPagination from "@/components/explore/Pagination";
import PaginationDemo from "@/components/explore/Pagination";
import SearchTap from "@/components/explore/SearchTap";
import { supabase } from "@/lib/supabase";
import { roomService } from "@/services/roomServices";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";



export default function RoomExplorePage({searchParams}:{searchParams:Promise<{page?:string}}) {
      const [roomList,setRoomList]=useState<any>([]);
      const[maxPage,setMaxPage]=useState(0);
      const [page,setPage] =useState(1);
      const {page}=await searchParams;

      const getRoomList=async () => {
            const roomList=await roomService.getRoomList();
            setRoomList(roomList);
      }

      const countPage = async ()=> {
      const count= await roomService.countMaxPage();
      if(count){
            const MaxPage=count/8+1;
            setMaxPage(MaxPage);
      }
      }
 

      useEffect(()=>{
           getRoomList(); 
           countPage();
      },[])

return (<div> 
      <SearchTap/>
      <AllListTap roomList={roomList}/>
      <RoomPagination page={page} maxPage={maxPage} onButtonClick={setPage}/>
      </div>
      )

}