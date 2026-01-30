import { v4 as uuidv4 } from 'uuid'; // npm install uuid

// 귀여운 랜덤 닉네임 조합
const ADJECTIVES = ["신나는", "배고픈", "춤추는", "노래하는", "졸린", "행복한"];
const ANIMALS = ["쿼카", "펭귄", "고양이", "강아지", "토끼", "다람쥐"];

export interface UserIdentity {
  id: string;
  name: string;
  isHost: boolean;
}

export const getGuestInfo = (): UserIdentity => {
  
  if (typeof window === 'undefined') {
    return { id: '', name: '', isHost: false };
  }

  // 2. 이미 저장된 게스트 정보가 있는지 확인 (재방문)
  const savedId = localStorage.getItem('guest_id');
  const savedName = localStorage.getItem('guest_name');

  if (savedId && savedName) {
    return { id: savedId, name: savedName, isHost: false };
  }

  // 3. 없으면 새로 생성 (신규 방문)
  const newId = `guest_${uuidv4()}`; 
  const newName = `${ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)]} ${
    ANIMALS[Math.floor(Math.random() * ANIMALS.length)]
  }`;

  localStorage.setItem('guest_id', newId);
  localStorage.setItem('guest_name', newName);

  return { id: newId, name: newName, isHost: false };
};