import { supabase } from "./supabase";

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
    // 1. 메모리에 유효한 토큰이 있으면 바로 반환 (가장 빠름)
    if (this.accessToken && Date.now() < this.tokenExpiresAt - 60000) { // 만료 1분 전까지는 안전하다고 판단
      return this.accessToken;
    }

    // 2. 없거나 만료됐다면? 갱신 절차 시작
    return this.ensureValidToken();
  }

  // 🔒 토큰 갱신 (Promise Locking 적용)
  private async ensureValidToken(): Promise<string> {
    // 이미 누군가 갱신을 하고 있다면? 그 녀석이 끝날 때까지 기다렸다가 결과만 받음 (중복 호출 방지)
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    // 아무도 갱신 안 하고 있다면? 내가 총대 메고 갱신 시작
    this.refreshPromise = (async () => {
      try {
        console.log(" 토큰 갱신 프로세스 시작...");
        
        // Supabase 세션 갱신 (이게 돌면 provider_token도 바뀜)
        const { data: { session }, error } = await this.supabase.auth.getSession();
          console.log(session," 세션값 확인");
          console.log(error,"에러 값 확인ㄴ");
          console.log(session?.provider_token,"값");
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