import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

// Mock data stores (in production, use a database)
const users: Record<string, any> = {}
const verificationCodes: Record<string, { code: string; expiresAt: number }> = {}

function extractEmailFromToken(token: string): string | null {
  // Simple token parsing - in production, use JWT
  // This is a simplified version
  return null
}

export async function POST(request: NextRequest) {
  try {
    const authorization = request.headers.get('Authorization')
    
    if (!authorization?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const token = authorization.substring(7)
    const body = await request.json()
    const { code } = body

    if (!code) {
      return NextResponse.json(
        { error: 'Verification code is required' },
        { status: 400 }
      )
    }

    // In production, verify JWT token and get user email
    // For now, we'll return a success response
    // This would need proper implementation with database

    // Find user with matching verification code
    let userEmail: string | null = null
    for (const [email, verification] of Object.entries(verificationCodes)) {
      if (verification.code === code && verification.expiresAt > Date.now()) {
        userEmail = email
        break
      }
    }

    if (!userEmail) {
      return NextResponse.json(
        { error: 'Invalid or expired verification code' },
        { status: 400 }
      )
    }

    // Mark user as verified
    if (users[userEmail]) {
      users[userEmail].verified = true
      delete verificationCodes[userEmail]
    }

    return NextResponse.json({
      message: 'Email verified successfully',
      user: {
        email: userEmail,
      },
    })
  } catch (error) {
    console.error('Email verification error:', error)
    return NextResponse.json(
      { error: 'Email verification failed' },
      { status: 500 }
    )
  }
}
