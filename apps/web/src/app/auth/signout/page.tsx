import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Sign Out - ClipForge AI',
  description: 'You have been signed out of ClipForge AI',
}

export default function SignOutPage() {
  return (
    <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:px-0">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Signed out successfully
          </h1>
          <p className="text-sm text-muted-foreground">
            You have been signed out of your ClipForge AI account
          </p>
        </div>
        <div className="text-center">
          <Link 
            href="/auth/signin" 
            className="text-sm font-medium text-primary underline-offset-4 hover:underline"
          >
            Sign in again
          </Link>
        </div>
      </div>
    </div>
  )
}