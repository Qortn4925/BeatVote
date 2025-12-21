'use client';

import Image from "next/image";

import { supabase } from '@/lib/supabase';

export default function Home() {
  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'spotify',
      options: {
        redirectTo: 'http://localhost:3000',
      },
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-4">BeatVote</h1>
      <button 
        onClick={handleLogin}
        className="bg-green-500 text-white px-6 py-2 rounded-full font-bold"
      >
        Spotify
      </button>
    </div>
  );
}