'use client';
import AllListTap from "@/components/explore/AllListTap";
import PaginationDemo from "@/components/explore/Pagination";
import SearchTap from "@/components/explore/SearchTap";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";



export default function RoomExplorePage() {
      const [roomList,setRoomList]=useState<any>([]);
      const [page,setPage] =useState(1);


      const getRoomList=async () => {
            const {data,error}=await supabase
            .from('rooms')
            .select()
            .limit(8);
            
          
           
            setRoomList(data);
      }
      const countPage = async ()=> {
      const {data,error}= await supabase
            .from('rooms')
            .select('*', { count: 'exact', head: true });

             console.log(data);
            
      }

      useEffect(()=>{
           getRoomList(); 
           countPage();
      },[])

return <div> 
      <SearchTap/>
      <AllListTap roomList={roomList}/>
      <PaginationDemo/>
      </div>

}