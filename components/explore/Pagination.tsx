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

  return (
    <Pagination>
    <PaginationContent className="w-full justify-between items-center">
        {hasPrevious &&( <PaginationItem >
          <PaginationPrevious href='#' className='border' onClick={()=>goToPage(page-1)}/>
        </PaginationItem>)}
        <PaginationItem>
          <p className='text-muted-foreground text-sm' aria-live='polite'>
            Page <span className='text-foreground'>{page}</span> of <span className='text-foreground'>{maxPage}</span>
          </p>
        </PaginationItem>

          {hasNext &&(
        <PaginationItem>
          <PaginationNext href='#' className='border' onClick={()=>goToPage(page+1)}/>
        </PaginationItem>)
          }
      </PaginationContent>
    </Pagination>
  )
}
