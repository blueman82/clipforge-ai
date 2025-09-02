import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Authentication Error - ClipForge AI',
  description: 'An error occurred during authentication',
}

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const params = await searchParams
  
  const getErrorMessage = (error: string | undefined) => {
    switch (error) {
      case 'Configuration':
        return 'There is a problem with the server configuration.'
      case 'AccessDenied':
        return 'Access denied. You do not have permission to sign in.'
      case 'Verification':
        return 'The verification token has expired or has already been used.'
      default:
        return 'An error occurred during authentication.'
    }
  }

  return (
    <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:px-0">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-destructive">
            Authentication Error
          </h1>
          <p className="text-sm text-muted-foreground">
            {getErrorMessage(params.error)}
          </p>
        </div>
        <div className="text-center space-y-2">
          <Link 
            href="/auth/signin" 
            className="text-sm font-medium text-primary underline-offset-4 hover:underline"
          >
            Try signing in again
          </Link>
          <br />
          <Link 
            href="/" 
            className="text-sm font-medium text-muted-foreground underline-offset-4 hover:underline"
          >
            Return to homepage
          </Link>
        </div>
      </div>
    </div>
  )
}