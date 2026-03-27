'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { AuthForm } from '@/components/auth-form'
import { useToast } from '@/hooks/use-toast'

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>()
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (data: any) => {
    setIsLoading(true)
    setError(undefined)

    try {
      const apiBase = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'
      const response = await fetch(`${apiBase}/api/auth/register/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
          phone: data.phone,
          userType: data.userType,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        setError(result.error || 'Registration failed')
        return
      }

      toast({
        title: 'Account Created',
        description: 'Your account has been created successfully. You can now sign in.',
      })

      // Store token and redirect to login
      localStorage.setItem('token', result.token)
      router.push('/login')
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
            type="register"
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
