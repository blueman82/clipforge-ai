'use client'

import { Sparkles, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import React, { useState } from 'react'

import { ThemeToggle } from '@/components/theme-toggle'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function Header() {
  const { data: session } = useSession()
  const [isProductOpen, setIsProductOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Sparkles className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl">ClipForge AI</span>
        </Link>

        <nav className="mx-6">
          <ul className="flex items-center space-x-1">
            <li className="relative">
              <button
                className={cn(
                  "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50",
                  isProductOpen && "bg-accent/50"
                )}
                onClick={() => setIsProductOpen(!isProductOpen)}
                onMouseEnter={() => setIsProductOpen(true)}
                onMouseLeave={() => setIsProductOpen(false)}
              >
                Product
                <ChevronDown
                  className={cn(
                    "relative top-[1px] ml-1 h-3 w-3 transition duration-200",
                    isProductOpen && "rotate-180"
                  )}
                  aria-hidden="true"
                />
              </button>
              {isProductOpen && (
                <div 
                  className="absolute left-0 top-full z-50 mt-1 w-[400px] lg:w-[500px] rounded-md border bg-popover text-popover-foreground shadow-lg"
                  onMouseEnter={() => setIsProductOpen(true)}
                  onMouseLeave={() => setIsProductOpen(false)}
                >
                  <ul className="grid gap-3 p-6 lg:grid-cols-[.75fr_1fr]">
                    <li className="row-span-3">
                      <Link
                        href="/"
                        className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md hover:bg-accent transition-colors"
                      >
                        <Sparkles className="h-6 w-6" />
                        <div className="mb-2 mt-4 text-lg font-medium">
                          ClipForge AI
                        </div>
                        <p className="text-sm leading-tight text-muted-foreground">
                          Create viral faceless videos with AI in minutes
                        </p>
                      </Link>
                    </li>
                    <DropdownItem href="/features" title="Features">
                      AI-powered script writing, voiceovers, and editing
                    </DropdownItem>
                    <DropdownItem href="/templates" title="Templates">
                      Ready-made templates for every platform
                    </DropdownItem>
                    <DropdownItem href="/examples" title="Examples">
                      See what others have created with ClipForge
                    </DropdownItem>
                  </ul>
                </div>
              )}
            </li>
            <li>
              <Link 
                href="/pricing" 
                className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50"
              >
                Pricing
              </Link>
            </li>
            <li>
              <Link 
                href="/affiliate" 
                className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50"
              >
                <span className="mr-1">Affiliates</span>
                <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                  New
                </span>
              </Link>
            </li>
            <li>
              <Link 
                href="/blog" 
                className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50"
              >
                Blog
              </Link>
            </li>
          </ul>
        </nav>

        <div className="ml-auto flex items-center space-x-4">
          <ThemeToggle />
          {session ? (
            <Button asChild>
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/auth/signin">Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/auth/signup">Get Started</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

const DropdownItem: React.FC<{ href: string; title: string; children: React.ReactNode; className?: string }> = ({ className, title, children, href }) => {
  return (
    <li>
      <Link
        href={href}
        className={cn(
          "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
          className
        )}
      >
        <div className="text-sm font-medium leading-none">{title}</div>
        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
          {children}
        </p>
      </Link>
    </li>
  )
}