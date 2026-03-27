import { NextRequest, NextResponse } from 'next/server'

// Mock data stores
const verificationCodes: Record<string, { code: string; expiresAt: number }> = {}

function generateVerificationCode(): string {
  return Math.random().toString().slice(2, 8)
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

    // In production, verify JWT token and extract user email
    // For now, we'll simulate this
    // This is a simplified implementation

    // Generate new verification code
    const verificationCode = generateVerificationCode()

    // In production:
    // 1. Extract email from token
    // 2. Store new verification code in database
    // 3. Send email with verification code

    console.log(`[DEV] New verification code: ${verificationCode}`)

    return NextResponse.json({
      message: 'Verification code sent to your email',
    })
  } catch (error) {
    console.error('Resend verification error:', error)
    return NextResponse.json(
      { error: 'Failed to resend verification code' },
      { status: 500 }
    )
  }
}
