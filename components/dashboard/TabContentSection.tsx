'use client';

import CurrentTrack from "@/app/host/dashboard/[code]/_components/music/CurrentTrack";
import PlayList from "@/app/host/dashboard/[code]/_components/music/PlayList";
import SearchBar from "@/app/host/dashboard/[code]/_components/music/SearchBar";
import { useTabStore, TabType } from "@/app/store/useTabStore"; // 경로 확인
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";


// 1. 탭 설정 데이터
const TABS: { value: TabType; label: string }[] = [
  { value: 'CURRENTTRACK', label: '현재 곡' },
  { value: 'PLAYLIST', label: '투표 목록' },
  { value: 'SEARCH', label: '곡 검색' },
];

// 2. 탭 네비게이션 컴포넌트 (내부용)
function TabNavigation() {
  const { activeTab, setTab } = useTabStore();
 return (
    // 1. 컨테이너에 w-full을 줘서 가로 폭을 확보합니다.
    <div className="w-full mb-4">
      <ToggleGroup 
        type="single" 
        size="sm" 
        variant="outline"
        value={activeTab} 
        onValueChange={(value) => { if (value) setTab(value as TabType); }}
        // 2. ToggleGroup 자체가 가로로 꽉 차도록 설정
        className="w-full flex" 
      >
        {TABS.map((tab) => (
          <ToggleGroupItem 
            key={tab.value} 
            value={tab.value} 
            aria-label={tab.label}
            className="flex-1 w-full"
          >
            {tab.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  )
}
// 3. Props 타입 정의 (Typescript 에러 방지)
interface TabContentProps {
  displayTrack: any;
  isPaused: boolean;
  handlePlayerControl: () => void;
  duration: number;
  position: number;
  playList: any[];
  myVotes: string[];
  handleVoteTrack: (id: string) => void;
  roomId: string;
  handleMusicAdded: (track: any) => void;
}

// 4. 메인 컴포넌트 (외부에서 쓸 것)
export default function TabContentSection({ 
  displayTrack, isPaused, handlePlayerControl, duration, position,
  playList, myVotes, handleVoteTrack, roomId, handleMusicAdded 
}: TabContentProps) {
  
  const { activeTab } = useTabStore();


  // 탭에 따른 컴포넌트 매핑
  const TAB_COMPONENTS = {
    CURRENTTRACK: (
      <CurrentTrack 
        displayTrack={displayTrack} 
        isPaused={isPaused} 
        onTogglePlay={handlePlayerControl} 
        duration={duration} 
        position={position}
      />
    ),
    PLAYLIST: (
      <PlayList 
        playList={playList} 
        myVotes={myVotes} 
        onVoted={handleVoteTrack}
      />
    ),
    SEARCH: (
      <SearchBar 
        roomId={roomId} 
        onMusicAdded={handleMusicAdded}
      />
    ),
  };

  return (
    <div className="w-full">
      <TabNavigation />
      <div className="mt-2 min-h-[300px]">
        {TAB_COMPONENTS[activeTab]}
      </div>
    </div>
  );
}