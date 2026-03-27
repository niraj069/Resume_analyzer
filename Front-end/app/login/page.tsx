'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { AuthForm } from '@/components/auth-form'
import { useToast } from '@/hooks/use-toast'

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>()
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (data: any) => {
    setIsLoading(true)
    setError(undefined)

    try {
      const apiBase = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'
      const response = await fetch(`${apiBase}/api/auth/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        setError(result.error || 'Login failed')
        return
      }

      toast({
        title: 'Success',
        description: 'You have been signed in successfully.',
      })

      // Store token and redirect to dashboard
      localStorage.setItem('token', result.token)
      router.push('/analyzer')
    } catch (err) {
      setError('An error occurred. Please try again.')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="w-full max-w-md">
          <AuthForm
            type="login"
            onSubmit={handleSubmit}
            isLoading={isLoading}
            error={error}
          />
        </div>
      </div>

      <Footer />
    </div>
  )
}
