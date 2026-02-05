'use client';
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce"; // npm install use-debounce 필요
import { Button } from "../ui/button";
export default function SearchTap(){
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

  
    // 사용자가 입력을 멈추고 0.3초 뒤에 실행 (서버 부하 방지)
    const handleSearch = useDebouncedCallback((term: string) => {
      const params = new URLSearchParams(searchParams);
      
      // 검색어가 바뀌면 1페이지로 리셋해주는 센스
      params.set('page', '1');

      if (term) {
        params.set('query', term);
      } else {
        params.delete('query');
      }

    // URL 업데이트 (히스토리에 쌓지 않고 교체)
    replace(`${pathname}?${params.toString()}`);
  }, 300);
    return (
    <div className="relative flex w-full md:w-[350px] items-center">
      <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
      
      
      <Input 
        type="text" 
        placeholder="방 제목이나 태그로 검색..." 
        className="pl-10 bg-secondary/50 border-transparent focus:border-primary rounded-full transition-all"
        defaultValue={searchParams.get('query')?.toString()}
        onChange={(e) => handleSearch(e.target.value)}
      />
      
      <Button 
        type="submit" 
        size="sm" 
        className="absolute right-1 rounded-full h-8 px-3 font-bold"
      >
        검색
      </Button>
    </div>
  
  );
        
} 