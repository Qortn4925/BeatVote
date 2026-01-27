import { CookieOptions, createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // 1. 기본 응답 객체 생성
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // 2. 미들웨어 전용 Supabase 클라이언트 설정
  const supabase = createServerClient(
    CookieOptions
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          // 요청과 응답 양쪽에 쿠키를 심어줘야 현재 렌더링에서도 바로 쓸 수 있음
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({
            request: { headers: request.headers },
          })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({
            request: { headers: request.headers },
          })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  // 3. 세션 정보 가져오기 (이 과정에서 토큰이 만료됐다면 자동으로 갱신 시도)
  const { data: { session } } = await supabase.auth.getSession()

  // 4. (선택사항) 로그인 안 된 유저가 보호된 페이지(/explore 등)에 접근하면 로그인으로 리다이렉트
  if (!session && request.nextUrl.pathname.startsWith('/explore')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return response
}

// 5. 미들웨어가 실행될 경로 설정 (정적 파일, 이미지는 제외)
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}