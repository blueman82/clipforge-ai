import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Check your email - ClipForge AI',
  description: 'A sign in link has been sent to your email address',
}

export default function VerifyRequestPage() {
  return (
    <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:px-0">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Check your email
          </h1>
          <p className="text-sm text-muted-foreground">
            A sign in link has been sent to your email address. Click the link in the email to sign in.
          </p>
        </div>
        <div className="text-center">
          <Link 
            href="/auth/signin" 
            className="text-sm font-medium text-primary underline-offset-4 hover:underline"
          >
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  )
}