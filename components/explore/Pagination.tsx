'use client';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface RoomPaginationProps{
  maxPage:number;
  page:number;
}

export default function RoomPagination({maxPage,page}:RoomPaginationProps) {
      const router= useRouter();
      const pathname =usePathname();
      const searchParams=useSearchParams();

      const hasPrevious=page!==1;
      const hasNext=page!==maxPage;

      const goToPage=(nextPage:number)=>{
        const param = new URLSearchParams(searchParams.toString());
        param.set('page',nextPage.toString());
        //url 변경
        router.push(`${pathname}?${param.toString()}`);
      }
  if (maxPage <= 1) return null;

  return (
    <Pagination>
      <PaginationContent className="w-full flex justify-center gap-4">
        
        {/* 이전 버튼: 비활성화 상태면 투명도 조절 */}
        <PaginationItem>
          <PaginationPrevious 
            href="#" 
            onClick={(e) => {
              e.preventDefault();
              if (hasPrevious) goToPage(page - 1);
            }}
            className={`cursor-pointer select-none transition-opacity ${!hasPrevious ? 'opacity-30 pointer-events-none' : ''}`}
          />
        </PaginationItem>

        <PaginationItem>
          <div className="px-4 py-2 rounded-md bg-secondary/50 text-sm font-medium">
             <span className="text-primary font-bold">{page}</span> 
             <span className="text-muted-foreground mx-2">/</span> 
             <span className="text-muted-foreground">{maxPage}</span>
          </div>
        </PaginationItem>

        <PaginationItem>
          <PaginationNext 
            href="#" 
            onClick={(e) => {
              e.preventDefault();
              if (hasNext) goToPage(page + 1);
            }}
            className={`cursor-pointer select-none transition-opacity ${!hasNext ? 'opacity-30 pointer-events-none' : ''}`}
          />
        </PaginationItem>

      </PaginationContent>
    </Pagination>
  );
}
