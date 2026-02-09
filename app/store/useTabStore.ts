import { create } from 'zustand'

export type TabType = 'PLAYLIST' | 'SEARCH' | 'CURRENTTRACK';
interface TabState{
    activeTab: TabType;
    setTab:(tab:'PLAYLIST' |'SEARCH'|'CURRENTTRACK')=> void;
}


export const useTabStore= create<TabState>((set)=>({
    activeTab:'PLAYLIST',
    setTab:(tab)=>set({activeTab:tab}),
}))