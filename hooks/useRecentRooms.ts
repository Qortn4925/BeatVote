'use client';

import { useState, useEffect } from 'react';

export interface RecentRoom {
  id: string;        // 방의 고유 ID (uuid)
  code: string;      // 접속 코드 (url용)
  title: string;     // 방 제목
  last_visited: number; // 정렬용 타임스탬프
}

export function useRecentRooms() {
  const [recentRooms, setRecentRooms] = useState<RecentRoom[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('recent_rooms');
      if (stored) {
        setRecentRooms(JSON.parse(stored));
      }
    }
  }, []);

  const addRoom = (room: Omit<RecentRoom, 'last_visited'>) => {
    const newItem = { ...room, last_visited: Date.now() };
    
    setRecentRooms((prev) => {
      const filtered = prev.filter((r) => r.id !== room.id);
      const updated = [newItem, ...filtered].slice(0, 10); // 최대 10개 유지
      
      localStorage.setItem('recent_rooms', JSON.stringify(updated));
      return updated;
    });
  };

  return { recentRooms, addRoom };
}