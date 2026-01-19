import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

interface RoomPaginationProps{
  maxPage:number;
  page:number;
  onButtonClick:(page:number)=>void;
}

export default function RoomPagination({maxPage,page,onButtonClick}:RoomPaginationProps) {
      const hasPrevious=page!==1;
      const hasNext=page!==maxPage;
  return (
    <Pagination>
    <PaginationContent className="w-full justify-between items-center">
        {hasPrevious &&( <PaginationItem >
          <PaginationPrevious href='#' className='border' onClick={(e) => {
                e.preventDefault(); // href="#" 로 인한 스크롤 튐 방지
                onButtonClick(page - 1);
              }} />
        </PaginationItem>)}
        <PaginationItem>
          <p className='text-muted-foreground text-sm' aria-live='polite'>
            Page <span className='text-foreground'>{page}</span> of <span className='text-foreground'>{maxPage}</span>
          </p>
        </PaginationItem>

          {hasNext &&(
        <PaginationItem>
          <PaginationNext href='#' className='border' onClick={(e) => {
                e.preventDefault(); // href="#" 로 인한 스크롤 튐 방지
                onButtonClick(page + 1);
              }}/>
        </PaginationItem>)
          }
      </PaginationContent>
    </Pagination>
  )
}
