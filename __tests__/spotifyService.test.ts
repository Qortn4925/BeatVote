import { redis } from '../lib/redis';
import { spotifyService } from '@/services/spotifyService';



process.env.NEXT_PUBLIC_CLIENT_ID = 'test-client-id';
process.env.NEXT_PUBLIC_CLIENT_SECRET = 'test-client-secret';
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';

jest.mock('../lib/supabase', () => ({
  supabase: {
    auth: { getSession: jest.fn() }
  }
}));

jest.mock('../lib/redis', () => ({
  redis: { get: jest.fn(), set: jest.fn() },
}));

global.fetch = jest.fn();

describe('spotifyService.search 통합 캐싱 테스트', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('검색 캐시가 있으면, 토큰 확인이나 fetch 호출 없이 즉시 반환해야 한다', async () => {
    // Given: Redis에 이미 검색 결과가 있다고 세팅
    const cachedData = [{ name: '미리 저장된 아이유 노래' }];
    (redis.get as jest.Mock).mockResolvedValue(cachedData);

    // When: 검색 실행
    const result = await spotifyService.search('아이유');

    // Then: 
    expect(redis.get).toHaveBeenCalledWith('spotify:search:아이유');
    expect(global.fetch).not.toHaveBeenCalled();
    expect(result).toEqual(cachedData);
  });

  it('검색 캐시가 없으면, 토큰을 가져와서 API를 호출하고 결과를 Redis에 저장해야 한다', async () => {
    // Given: 
    (redis.get as jest.Mock)
      .mockResolvedValueOnce(null)          
      .mockResolvedValueOnce('valid-token');

    // Spotify API 검색 결과 모킹
    const mockSpotifyResponse = {
      tracks: {
        items: [{ id: '1', name: '좋은 날', artists: [{ name: '아이유' }], album: { images: [] }, uri: 'uri' }]
      }
    };
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockSpotifyResponse,
    });

    // When: 검색 실행
    const result = await spotifyService.search('아이유');


    // fetch가 딱 1번(검색 API) 호출되었는가?
    expect(global.fetch).toHaveBeenCalledTimes(1);
    
    // 검색 결과를 Redis에 
    expect(redis.set).toHaveBeenCalledWith(
      'spotify:search:아이유',
      expect.any(Array), 
      { ex: 3600 }
    );
    
    expect(result[0].name).toBe('좋은 날');
    expect(result[0].artist).toBe('아이유');
  });
});