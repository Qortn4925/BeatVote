'use client';

import Image from "next/image";

import { supabase } from '@/lib/supabase';
import { access } from "fs";

export default function Home() {
  
  const handleLogin = async () => {
    const origin = window.location.origin;
    await supabase.auth.signInWithOAuth({
      provider: 'spotify',
      options: {
        scopes: 'user-read-email user-read-private user-library-read user-modify-playback-state streaming user-read-playback-state',
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
        redirectTo: `${origin}/host/dashboard`,
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