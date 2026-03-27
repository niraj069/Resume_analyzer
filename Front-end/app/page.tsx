import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ArrowRight, Zap, Target, Users, BarChart3, Shield, Sparkles } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-6 mb-12">
            <div className="inline-block">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20">
                <Sparkles className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium text-accent">AI-Powered Resume Analysis</span>
              </div>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-balance">
              Land Your Dream Job with
              <span className="block bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                AI Resume Insights
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
              Analyze your resume with advanced AI technology. Get actionable insights, identify improvement areas, and optimize for ATS systems.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground group"
                asChild
              >
                <Link href="/register">
                  Get Started Free
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
              >
                <Link href="#how-it-works">Learn More</Link>
              </Button>
            </div>
          </div>

          {/* Hero Image/Illustration placeholder */}
          <div className="relative h-96 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 border border-border flex items-center justify-center mt-16">
            <div className="text-center">
              <BarChart3 className="w-20 h-20 text-primary/30 mx-auto mb-4" />
              <p className="text-muted-foreground">Dashboard Preview</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold">Powerful Features</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to perfect your resume and stand out to employers.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <Card className="p-6 hover:shadow-lg transition-shadow border-border">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Instant Analysis</h3>
              <p className="text-muted-foreground">
                Get comprehensive feedback on your resume in seconds using advanced AI analysis.
              </p>
            </Card>

            {/* Feature 2 */}
            <Card className="p-6 hover:shadow-lg transition-shadow border-border">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">ATS Optimization</h3>
              <p className="text-muted-foreground">
                Ensure your resume passes Applicant Tracking Systems and reaches recruiters.
              </p>
            </Card>

            {/* Feature 3 */}
            <Card className="p-6 hover:shadow-lg transition-shadow border-border">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Detailed Metrics</h3>
              <p className="text-muted-foreground">
                Track improvement over time with detailed scoring and performance metrics.
              </p>
            </Card>

            {/* Feature 4 */}
            <Card className="p-6 hover:shadow-lg transition-shadow border-border">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Expert Insights</h3>
              <p className="text-muted-foreground">
                Receive actionable recommendations from industry experts and hiring managers.
              </p>
            </Card>

            {/* Feature 5 */}
            <Card className="p-6 hover:shadow-lg transition-shadow border-border">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Privacy First</h3>
              <p className="text-muted-foreground">
                Your resume data is encrypted and never shared with third parties.
              </p>
            </Card>

            {/* Feature 6 */}
            <Card className="p-6 hover:shadow-lg transition-shadow border-border">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Smart Suggestions</h3>
              <p className="text-muted-foreground">
                Get AI-powered suggestions to improve wording, impact, and overall quality.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="px-4 sm:px-6 lg:px-8 py-20 bg-card">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold">How It Works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Simple steps to improve your resume and boost your chances of getting hired.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 font-bold text-xl">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Upload Resume</h3>
              <p className="text-muted-foreground">
                Sign up and upload your resume in PDF, Word, or text format.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 font-bold text-xl">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Get Analysis</h3>
              <p className="text-muted-foreground">
                Our AI analyzes your resume and provides detailed feedback in seconds.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 font-bold text-xl">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Improve & Download</h3>
              <p className="text-muted-foreground">
                Implement suggestions and download your optimized resume instantly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-bold">Ready to Level Up Your Resume?</h2>
          <p className="text-lg text-muted-foreground">
            Join thousands of job seekers who have improved their resumes with our AI-powered platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground group"
              asChild
            >
              <Link href="/register">
                Start Free Trial
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
