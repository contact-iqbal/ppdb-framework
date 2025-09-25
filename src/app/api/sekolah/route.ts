import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const jenjang = searchParams.get('jenjang')

    if (!jenjang) {
      return NextResponse.json({ error: 'Jenjang parameter is required' }, { status: 400 })
    }

    const results = await query(
      'SELECT * FROM sekolah WHERE jenjang = ?',
      [jenjang]
    )

    return NextResponse.json(results)
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}