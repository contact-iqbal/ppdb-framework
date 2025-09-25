import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value

    if (!token) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any

    return NextResponse.json({ 
      user: { 
        id: decoded.userId, 
        email: decoded.email, 
        nama: decoded.nama 
      } 
    })
  } catch (error) {
    console.error('Auth verification error:', error)
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 })
  }
}