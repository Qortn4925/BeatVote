'use client';
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation";
export default function DashBoardPage() {
   

   return (
    <div className="h-full flex items-center justify-center text-gray-400">
      <p>왼쪽 목록에서 방을 선택하거나 새로운 방을 만들어보세요!</p>
    </div>
  );
}