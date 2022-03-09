import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.JWT_SECRET })

  const { pathname } = req.nextUrl
  //Allow the request if the folliwing is true
  // 1) path is to api/auth
  // 2) token exists
  if (pathname.includes('/login') || token) {
    return NextResponse.next()
  }

  //Redirect them to login if the y dont have a token and the path is not to api/auth
  if (!token && !pathname.includes('/api/auth')) {
    const url = req.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }
}
