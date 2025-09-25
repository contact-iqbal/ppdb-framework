import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/database'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, nama, tanggal_lahir, wa, nik, lemdik } = body

    // Validate required fields
    if (!email || !password || !nama || !tanggal_lahir || !wa || !nik) {
      return NextResponse.json({ message: 'Semua field harus diisi!' }, { status: 400 })
    }

    // Check if email already exists
    const existingUser = await query('SELECT id FROM users WHERE email = ?', [email])
    
    if (Array.isArray(existingUser) && existingUser.length > 0) {
      return NextResponse.json({ message: 'Email sudah terdaftar!' }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Insert new user
    const result = await query(
      'INSERT INTO users (email, password, nama, tanggal_lahir, wa, nik) VALUES (?, ?, ?, ?, ?, ?)',
      [email, hashedPassword, nama, tanggal_lahir, wa, nik]
    ) as any

    // Create JWT token
    const token = jwt.sign(
      { 
        userId: result.insertId, 
        email, 
        nama 
      },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    )

    // Create response
    const response = NextResponse.json({ 
      message: 'Pendaftaran berhasil!',
      user: { id: result.insertId, email, nama }
    })

    // Set HTTP-only cookie
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    })

    return response
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json({ message: 'Terjadi kesalahan sistem!' }, { status: 500 })
  }
}