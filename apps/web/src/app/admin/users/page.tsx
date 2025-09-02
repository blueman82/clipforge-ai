import { 
  Video, 
  Plus, 
  TrendingUp, 
  CreditCard, 
  Users,
  Clock
} from 'lucide-react'
import Link from 'next/link'
import { getServerSession } from 'next-auth'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { authOptions } from '@/lib/auth'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, {session?.user?.name?.split(' ')[0] || 'Creator'}!
          </h1>
          <p className="text-muted-foreground">
            Here&apos;s what&apos;s happening with your projects today.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/projects/new">
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <Video className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              +2 from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Credits Remaining</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">47</div>
            <p className="text-xs text-muted-foreground">
              Resets in 12 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">324.5K</div>
            <p className="text-xs text-muted-foreground">
              +12.3% from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Referrals</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              $240 earned this month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Projects */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-full">
          <CardHeader>
            <CardTitle>Recent Projects</CardTitle>
            <CardDescription>
              Your latest video projects and their status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Tech Tips for Beginners", status: "completed", views: "12.4K", duration: "0:58" },
                { name: "Life Hacks Everyone Should Know", status: "processing", views: "-", duration: "1:23" },
                { name: "History Facts That Will Blow Your Mind", status: "completed", views: "8.9K", duration: "1:05" },
              ].map((project, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="w-16 h-9 bg-muted rounded flex items-center justify-center">
                    <Video className="h-4 w-4" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {project.name}
                    </p>
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant={project.status === 'completed' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {project.status === 'processing' && (
                          <Clock className="w-3 h-3 mr-1" />
                        )}
                        {project.status}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {project.views} views • {project.duration}
                      </span>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t">
              <Button variant="outline" className="w-full" asChild>
                <Link href="/dashboard/projects">View All Projects</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Jump into your most common tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Button variant="outline" className="h-20 flex-col space-y-2" asChild>
              <Link href="/dashboard/projects/new">
                <Plus className="h-6 w-6" />
                <span>Create New Project</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2" asChild>
              <Link href="/dashboard/templates">
                <Video className="h-6 w-6" />
                <span>Browse Templates</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2" asChild>
              <Link href="/dashboard/billing">
                <CreditCard className="h-6 w-6" />
                <span>Upgrade Plan</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}