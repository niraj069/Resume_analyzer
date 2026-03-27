'use client'

import Link from 'next/link'
import { ThemeToggle } from '@/components/theme-toggle'
import { Button } from '@/components/ui/button'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Zap } from 'lucide-react'

export function Navbar() {
  const pathname = usePathname()
  const isAuthPage = pathname === '/login' || pathname === '/register' || pathname === '/verify-email'
  const isAnalyzerPage = pathname === '/analyzer'
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    setIsLoggedIn(!!token)
  }, [])

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center group-hover:shadow-lg transition-shadow">
              <Zap className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg hidden sm:inline bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              ResumeAI
            </span>
          </Link>

          {/* Center Navigation */}
          {!isAuthPage && (
            <div className="hidden md:flex items-center gap-8">
              <Link
                href="#features"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Features
              </Link>
              <Link
                href="#how-it-works"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                How It Works
              </Link>
              <Link
                href="#contact"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Contact
              </Link>
            </div>
          )}

          {/* Right side - Theme toggle & Auth buttons */}
          <div className="flex items-center gap-3">
            <ThemeToggle />
            {isLoggedIn && !isAnalyzerPage && (
              <Button
                size="sm"
                className="bg-primary hover:bg-primary/90"
                asChild
              >
                <Link href="/analyzer">Resume Analyzer</Link>
              </Button>
            )}
            {!isAuthPage && !isLoggedIn && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                >
                  <Link href="/login">Login</Link>
                </Button>
                <Button
                  size="sm"
                  className="bg-primary hover:bg-primary/90"
                  asChild
                >
                  <Link href="/register">Sign up</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
