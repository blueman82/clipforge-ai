import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'

import { AdminHeader } from '@/components/admin/header'
import { AdminNav } from '@/components/admin/nav'
import { authOptions } from '@/lib/auth'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    redirect('/api/auth/signin')
  }

  // Basic admin check - extend with proper role system later
  const isAdmin = session.user.email === 'admin@clipforge.ai' || 
                  session.user.email?.includes('admin')

  if (!isAdmin) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader user={session.user} />
      <div className="flex">
        <AdminNav />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
