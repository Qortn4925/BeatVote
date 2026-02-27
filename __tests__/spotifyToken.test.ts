import { searchSpotify } from '@/app/actions/spotifyActions';
import { redis } from '../lib/redis';


jest.mock('../lib/redis', () => ({
  redis: {
    get: jest.fn(),
    set: jest.fn(),
  },
}));

describe('Spotify 공용 토큰 캐싱 로직', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('Redis에 토큰이 없으면 Spotify API로 새로 발급받고 3500초 동안 저장해야 한다', async () => {
    // Given: Redis에 토큰 없음
    (redis.get as jest.Mock).mockResolvedValue(null);
    
    // Given: 가짜 토큰 응답 세팅
    const mockTokenResponse = { access_token: 'new-mock-token', expires_in: 3600 };
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockTokenResponse),
    });

    // When: 토큰 요청 함수 실행
    const token = await getSpotifyAppToken();

    // Then: 검증
    expect(redis.get).toHaveBeenCalledWith('spotify:app_token');
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(redis.set).toHaveBeenCalledWith(
      'spotify:app_token', 
      'new-mock-token', 
      { ex: 3500 } // 3600초보다 약간 짧게 저장
    );
    expect(token).toBe('new-mock-token');
  });
});