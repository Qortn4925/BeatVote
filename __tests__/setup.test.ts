describe('Jest 초기 세팅 확인', () => {
  it('1 + 1은 2여야 한다', () => {
    // Given (준비)
    const a = 1;
    const b = 1;

    // When (실행)
    const result = a + b;

    // Then (검증)
    expect(result).toBe(2);
  });
});