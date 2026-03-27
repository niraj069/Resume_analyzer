import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

// This would normally connect to a database
// For now, we'll use the same mock data structure
// In production, implement proper database queries
const mockUsers: Record<string, any> = {}

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex')
}

function generateToken(email: string): string {
  const timestamp = Date.now()
  return crypto
    .createHmac('sha256', 'your-secret-key')
    .update(`${email}:${timestamp}`)
    .digest('hex')
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // In production, query database
    const user = mockUsers[email]

    if (!user || user.password !== hashPassword(password)) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    if (!user.verified) {
      return NextResponse.json(
        { error: 'Please verify your email first' },
        { status: 401 }
      )
    }

    const token = generateToken(email)

    return NextResponse.json({
      token,
      user: {
        email: user.email,
        name: user.name,
      },
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    )
  }
}
