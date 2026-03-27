'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Loader2, LogOut, Upload, FileText } from 'lucide-react'

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }

    // Redirect to analyzer page
    router.push('/analyzer')
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('token')
    router.push('/')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />

      {/* Main Content */}
      <div className="flex-1 px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-12">
            <div>
              <h1 className="text-3xl font-bold">Welcome, {user?.name}!</h1>
              <p className="text-muted-foreground mt-2">Analyze and improve your resume with AI</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="p-6 border-border">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Resumes Analyzed</p>
                <p className="text-3xl font-bold">0</p>
              </div>
            </Card>
            <Card className="p-6 border-border">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Average Score</p>
                <p className="text-3xl font-bold">--</p>
              </div>
            </Card>
            <Card className="p-6 border-border">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Last Analysis</p>
                <p className="text-sm text-muted-foreground">Never</p>
              </div>
            </Card>
          </div>

          {/* Upload Section */}
          <Card className="p-8 border-border border-dashed bg-card/50">
            <div className="space-y-4 text-center">
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Upload className="w-8 h-8 text-primary" />
                </div>
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-2">Upload Your Resume</h2>
                <p className="text-muted-foreground mb-6">
                  Drag and drop your resume or click to browse. Supports PDF, DOC, and text files.
                </p>
              </div>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <FileText className="mr-2 w-4 h-4" />
                Choose File
              </Button>
            </div>
          </Card>

          {/* Coming Soon Section */}
          <div className="mt-12 p-8 rounded-lg bg-accent/5 border border-accent/20">
            <h3 className="font-semibold mb-2">Coming Soon</h3>
            <p className="text-muted-foreground">
              Resume analysis, detailed feedback, and optimization suggestions will be available soon.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
