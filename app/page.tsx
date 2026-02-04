'use client';

import Image from "next/image";

import { supabase } from '@/lib/supabase';
import { access } from "fs";

export default function Home() {
  

 

  return (
    <div className="flex min-h-screen w-full bg-black text-white">
    
     <LoginForm/>
       
      <div 
        className="relative hidden w-1/2 overflow-hidden lg:block"
        style={{
            backgroundColor: '#050505', 
            backgroundImage: "url('/images/background.png')", 
          
            backgroundSize: "cover", 
            backgroundRepeat: "no-repeat", 
            backgroundPosition: "center center"
        }}
      >
       <div className="absolute inset-0 bg-[#1DB954]/10 mix-blend-overlay pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/40 pointer-events-none" />
        
       
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
           <div className="w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
        </div>
      </div>
      </div>
  );
}


function LoginForm(){
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
  <div className="flex w-full flex-col justify-center px-8 lg:w-1/2 xl:px-24 bg-black relative">
        <div className="absolute top-[-20%] left-[-20%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="mx-auto w-full max-w-md space-y-12 relative z-10">
      <div className="space-y-6 text-center lg:text-left">
          <div className="relative w-24 h-24 mx-auto lg:mx-0 mb-4">
             <Image 
               src="/images/BeatVoteIcon.png" 
               alt="BeatVote Logo" 
               fill 
               className="object-contain mix-blend-screen drop-shadow-[0_0_10px_rgba(29,185,84,0.5)]"
             />
          </div>
            <h1 className="text-6xl font-black tracking-tighter text-[#1DB954]">
              BeatVote
            </h1>
            <p className="text-lg font-medium text-gray-600">
              실시간으로 소통하며 완성하는 우리만의 플레이리스트. <br />
              지금 스포티파이로 접속해 보세요.
            </p>
          </div>
        

          {/* 로그인 버튼 */}
          <div className="space-y-4">
            <button
              onClick={handleLogin}
              className="flex w-full items-center justify-center gap-4 rounded-full bg-[#1DB954] py-4 text-lg font-bold text-white transition-all hover:bg-[#1ed760] hover:shadow-2xl active:scale-95"
            >
              <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.49 17.303c-.215.353-.674.463-1.026.248-2.85-1.743-6.436-2.138-10.658-1.174-.403.093-.807-.158-.9-.56-.093-.402.158-.807.56-.9 4.622-1.058 8.59-.6 11.776 1.348.353.216.463.674.248 1.026zm1.465-3.26c-.27.44-.846.58-1.285.31-3.263-2.003-8.238-2.585-12.097-1.413-.496.15-1.023-.13-1.173-.626-.15-.496.13-1.023.626-1.173 4.417-1.34 9.91-.68 13.62 1.597.44.27.58.846.31 1.285zm.126-3.41c-3.913-2.325-10.363-2.54-14.126-1.397-.6.18-1.24-.154-1.42-.754-.18-.6.154-1.24.754-1.42 4.316-1.31 11.436-1.05 15.955 1.633.54.32.715 1.014.395 1.554-.32.54-1.014.715-1.554.395z" />
              </svg>
              Log in with Spotify
            </button>
            <p className="text-center text-sm text-gray-400">
              로그인 시 스포티파이 계정 약관에 동의하게 됩니다.
            </p>
          </div>
        </div>
      </div>
  )
}