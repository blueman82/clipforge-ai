'use client'

import { Github, Mail, Chrome } from 'lucide-react'
import { signIn } from 'next-auth/react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'

export function SignInForm() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState<string | null>(null)

  const handleSignIn = async (provider: string, email?: string) => {
    setIsLoading(provider)
    try {
      await signIn(provider, 
        email ? { email, callbackUrl: '/dashboard' } : { callbackUrl: '/dashboard' }
      )
    } catch (error) {
      console.error('Sign in error:', error)
    } finally {
      setIsLoading(null)
    }
  }

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      await handleSignIn('email', email)
    }
  }

  return (
    <div className="grid gap-6">
      <form onSubmit={handleEmailSignIn}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <label className="sr-only" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading === 'email'}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <Button 
            disabled={isLoading === 'email' || !email} 
            type="submit"
            className="w-full"
          >
            {isLoading === 'email' && (
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent" />
            )}
            <Mail className="mr-2 h-4 w-4" />
            Sign In with Email
          </Button>
        </div>
      </form>
      
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      
      <div className="grid gap-2">
        <Button
          variant="outline"
          onClick={() => handleSignIn('google')}
          disabled={!!isLoading}
          className="w-full"
        >
          {isLoading === 'google' ? (
            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent" />
          ) : (
            <Chrome className="mr-2 h-4 w-4" />
          )}
          Google
        </Button>
        
        <Button
          variant="outline"
          onClick={() => handleSignIn('github')}
          disabled={!!isLoading}
          className="w-full"
        >
          {isLoading === 'github' ? (
            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent" />
          ) : (
            <Github className="mr-2 h-4 w-4" />
          )}
          GitHub
        </Button>
      </div>
    </div>
  )
}