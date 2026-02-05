import { create } from 'zustand'
interface TabState{
    activeTab:'PLAYLIST' |'SEARCH';
    setTab:(tab:'PLAYLIST' |'SEARCH')=> void;
}


export const useTabStore= create<TabState>((set)=>({
    activeTab:'PLAYLIST',
    setTab:(tab)=>set({activeTab:tab}),
}))