import { supabase } from "../supabase";

class SpotifyTokenManager {
  private static instance: SpotifyTokenManager;
  private supabase =  supabase
  
  private accessToken: string | null = null;
  private tokenExpiresAt: number = 0; 
  private refreshPromise: Promise<string> | null = null; 

  private constructor() {
    // 1. 탭이 백그라운드에서 돌아왔을 때(깨어났을 때) 즉시 상태 점검
    if (typeof window !== 'undefined') {
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
          this.ensureValidToken().catch(console.error);
        }
      });
    }
  }

  public static getInstance(): SpotifyTokenManager {
    if (!SpotifyTokenManager.instance) {
      SpotifyTokenManager.instance = new SpotifyTokenManager();
    }
    return SpotifyTokenManager.instance;
  }

  //   토큰 갱신 함수
  public async getToken(): Promise<string> {
    // 1. 메모리에 유효한 토큰이 있으면 바로 반환 
    if (this.accessToken && Date.now() < this.tokenExpiresAt - 60000) { 
      return this.accessToken;
    }

    // 2. 없거나 만료됐다면? 갱신 절차 시작
    return this.ensureValidToken();
  }

  private async ensureValidToken(): Promise<string> {
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = (async () => {
      try {
        // Supabase 세션 갱신
        const { data: { session }, error } = await this.supabase.auth.getSession();
        if (error || !session?.provider_token) {
          throw new Error("토큰 갱신 실패: 다시 로그인해주세요.");
        }
        // 상태 업데이트
        this.accessToken = session.provider_token;
        // expires_at은 초 단위이므로 ms로 변환
        this.tokenExpiresAt = (session.expires_at || 0) * 1000; 

        console.log(" 토큰 갱신 완료!");
        return session.provider_token;
      } finally {
        // 작업 끝나면 잠금 해제
        this.refreshPromise = null;
      }
    })();
    return this.refreshPromise;
  }
}

export const spotifyTokenManager = SpotifyTokenManager.getInstance();