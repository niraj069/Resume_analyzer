import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

// Simple in-memory database for demonstration
// In production, use a real database like Supabase, Postgres, etc.
const users: Record<string, any> = {}
const verificationCodes: Record<string, { code: string; expiresAt: number }> = {}

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex')
}

function generateVerificationCode(): string {
  return Math.random().toString().slice(2, 8)
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
    const { name, email, password, phone, userType } = body

    // Validation
    if (!name || !email || !password || !phone || !userType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      )
    }

    // Check if user already exists
    if (users[email]) {
      return NextResponse.json(
        { error: 'Email already in use' },
        { status: 409 }
      )
    }

    // Create user
    const verificationCode = generateVerificationCode()
    const token = generateToken(email)

    users[email] = {
      name,
      email,
      password: hashPassword(password),
      phone,
      userType,
      verified: false,
      createdAt: new Date(),
    }

    verificationCodes[email] = {
      code: verificationCode,
      expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    }

    // In production, send verification email here
    console.log(`[DEV] Verification code for ${email}: ${verificationCode}`)

    return NextResponse.json({
      token,
      user: {
        email: users[email].email,
        name: users[email].name,
      },
    })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    )
  }
}
