'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { Mail, Loader2, ArrowRight } from 'lucide-react'

export default function VerifyEmailPage() {
  const [verificationCode, setVerificationCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>()
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(undefined)

    try {
      const token = localStorage.getItem('token')
      if (!token) {
        setError('Session expired. Please log in again.')
        router.push('/login')
        return
      }

      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ code: verificationCode }),
      })

      const result = await response.json()

      if (!response.ok) {
        setError(result.error || 'Verification failed')
        return
      }

      setSuccess(true)
      toast({
        title: 'Email Verified',
        description: 'Your email has been verified successfully!',
      })

      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        router.push('/dashboard')
      }, 2000)
    } catch (err) {
      setError('An error occurred. Please try again.')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendCode = async () => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        toast({
          title: 'Code Sent',
          description: 'Check your email for the verification code.',
        })
      } else {
        setError('Failed to resend code. Please try again.')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <Card className="w-full max-w-md p-8 border-border">
          <div className="space-y-6">
            {/* Icon */}
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Mail className="w-8 h-8 text-primary" />
              </div>
            </div>

            {/* Header */}
            <div className="space-y-2 text-center">
              <h1 className="text-2xl font-bold text-foreground">
                {success ? 'Email Verified!' : 'Verify Your Email'}
              </h1>
              <p className="text-sm text-muted-foreground">
                {success
                  ? "You're all set. Redirecting to your dashboard..."
                  : 'We sent a verification code to your email address. Enter it below to verify.'}
              </p>
            </div>

            {/* Success State */}
            {success ? (
              <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 text-center">
                <p className="text-sm font-medium text-green-800 dark:text-green-200">
                  ✓ Email verified successfully
                </p>
              </div>
            ) : (
              <>
                {/* Error Message */}
                {error && (
                  <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive">
                    {error}
                  </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="code" className="text-foreground">
                      Verification Code
                    </Label>
                    <Input
                      id="code"
                      type="text"
                      placeholder="Enter 6-digit code"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value.toUpperCase())}
                      maxLength={6}
                      required
                      className="border-border bg-input text-center text-lg tracking-widest"
                    />
                    <p className="text-xs text-muted-foreground">
                      Check your email for the verification code
                    </p>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isLoading || verificationCode.length < 6}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        Verify Email
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>

                {/* Resend Code */}
                <div className="text-center text-sm text-muted-foreground">
                  Didn&apos;t receive the code?{' '}
                  <button
                    onClick={handleResendCode}
                    disabled={isLoading}
                    className="text-primary hover:underline font-medium disabled:opacity-50"
                  >
                    Resend
                  </button>
                </div>
              </>
            )}
          </div>
        </Card>
      </div>

      <Footer />
    </div>
  )
}
