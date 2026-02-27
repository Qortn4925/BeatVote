import { searchSpotify } from '@/app/actions/spotifyActions';
import { redis } from '../lib/redis';


jest.mock('../lib/redis', () => ({
  redis: {
    get: jest.fn(),
    set: jest.fn(),
  },
}));

describe('Spotify 검색 캐싱 로직 테스트 - Cache miss 시나리오', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Redis에 데이터가 없으면 실제로 검색하고, Redis에 저장해야 한다.', async () => {
    //1. given
    const searchQuery = '아이유';
    const mockApiResult = { tracks: [{ name: '좋은 날' }] };
    
    (redis.get as jest.Mock).mockResolvedValue(null);

    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockApiResult)
    });

    // 2. When 
    const redisResult= redis.get(`spotify:search:${searchQuery}`);
    const finalResult = await searchSpotify(searchQuery);

    // 3. Then  , redis get, api호출, redis 저장
    expect(redis.get).toHaveBeenCalledWith(`spotify:search:${searchQuery}`);
    
    expect(global.fetch).toHaveBeenCalled();    
    expect(redis.set).toHaveBeenCalledWith(
      `spotify:search:${searchQuery}`, 
      mockApiResult, 
      expect.any(Object) // TTL 설정 객체 등 아무 객체나 와도 통과
    );
    
    // - 최종 반환값이 API 결과와 동일한가?
    expect(finalResult).toEqual(mockApiResult);
  });
});