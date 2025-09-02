'use client'

import { 
  Shield, 
  Users, 
  FileVideo, 
  Settings, 
  Database,
  BarChart3
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { cn } from '@/lib/utils'

const navigation = [
  {
    name: 'Overview',
    href: '/admin',
    icon: Shield,
  },
  {
    name: 'Users',
    href: '/admin/users',
    icon: Users,
  },
  {
    name: 'Templates',
    href: '/admin/templates',
    icon: FileVideo,
  },
  {
    name: 'Analytics',
    href: '/admin/analytics',
    icon: BarChart3,
  },
  {
    name: 'Database',
    href: '/admin/database',
    icon: Database,
  },
  {
    name: 'Settings',
    href: '/admin/settings',
    icon: Settings,
  },
]

export function AdminNav() {
  const pathname = usePathname()

  return (
    <nav className="w-64 bg-muted/30 border-r min-h-[calc(100vh-4rem)]">
      <div className="p-4">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  )}
                  >
                  <item.icon className="mr-3 h-4 w-4" />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}