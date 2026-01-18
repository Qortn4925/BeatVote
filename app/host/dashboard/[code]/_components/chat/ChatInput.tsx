

import React, { useState, useRef } from 'react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

export default function ChatInput ({ onSendMessage, disabled }: ChatInputProps) {
  const [text, setText] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 공백만 있거나 비어있으면 전송 방지
    if (!text.trim() || disabled) return;

    // 부모(ChatSection)에게 메시지 전달
    onSendMessage(text);

    // 입력창 초기화 및 포커스 유지
    setText('');
    inputRef.current?.focus();
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className="flex items-center gap-2 p-4 border-t bg-white"
    >
      <input
        ref={inputRef}
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={disabled ? "연결 중..." : "메시지를 입력하세요..."}
        disabled={disabled}
        className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
      />
      <button
        type="submit"
        disabled={!text.trim() || disabled}
        className="px-4 py-2 bg-green-500 text-white rounded-lg font-bold hover:bg-green-600 disabled:bg-gray-300 transition-colors"
      >
        전송
      </button>
    </form>
  );
};