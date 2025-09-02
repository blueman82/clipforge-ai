import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Video, 
  Plus, 
  MoreHorizontal,
  Play,
  Download,
  Trash2,
  Clock,
  Eye
} from 'lucide-react'
import Link from 'next/link'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

// Mock data - would come from database
const projects = [
  {
    id: '1',
    title: 'Tech Tips for Beginners',
    description: 'A comprehensive guide to getting started with technology',
    status: 'completed',
    thumbnail: '/thumbnails/tech-tips.jpg',
    duration: '0:58',
    views: 12400,
    createdAt: '2025-09-01',
  },
  {
    id: '2',
    title: 'Life Hacks Everyone Should Know',
    description: 'Simple tricks to make your daily life easier',
    status: 'processing',
    thumbnail: '/thumbnails/life-hacks.jpg',
    duration: '1:23',
    views: 0,
    createdAt: '2025-09-02',
  },
  {
    id: '3',
    title: 'History Facts That Will Blow Your Mind',
    description: 'Fascinating historical events you never learned in school',
    status: 'completed',
    thumbnail: '/thumbnails/history.jpg',
    duration: '1:05',
    views: 8900,
    createdAt: '2025-08-30',
  },
  {
    id: '4',
    title: 'Science Explained Simply',
    description: 'Complex scientific concepts made easy to understand',
    status: 'draft',
    thumbnail: '/thumbnails/science.jpg',
    duration: '0:00',
    views: 0,
    createdAt: '2025-09-02',
  },
]

function getStatusBadge(status: string) {
  switch (status) {
    case 'completed':
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Completed</Badge>
    case 'processing':
      return (
        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
          <Clock className="w-3 h-3 mr-1" />
          Processing
        </Badge>
      )
    case 'draft':
      return <Badge variant="outline">Draft</Badge>
    case 'failed':
      return <Badge variant="destructive">Failed</Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

function formatViews(views: number) {
  if (views >= 1000000) {
    return `${(views / 1000000).toFixed(1)}M`
  }
  if (views >= 1000) {
    return `${(views / 1000).toFixed(1)}K`
  }
  return views.toString()
}

export default async function ProjectsPage() {
  const session = await getServerSession(authOptions)

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">
            Manage your video projects and track their performance.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/projects/new">
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Link>
        </Button>
      </div>

      {/* Projects Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Card key={project.id} className="overflow-hidden">
            <div className="aspect-video bg-muted relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <Video className="h-8 w-8 text-muted-foreground" />
              </div>
              {project.status === 'completed' && (
                <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/50">
                  <Button size="sm" variant="secondary">
                    <Play className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                </div>
              )}
              <div className="absolute top-2 left-2">
                {getStatusBadge(project.status)}
              </div>
              <div className="absolute top-2 right-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/dashboard/projects/${project.id}/edit`}>
                        Edit Project
                      </Link>
                    </DropdownMenuItem>
                    {project.status === 'completed' && (
                      <>
                        <DropdownMenuItem>
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          Analytics
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              {project.duration !== '0:00' && (
                <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                  {project.duration}
                </div>
              )}
            </div>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg line-clamp-1">{project.title}</CardTitle>
              <CardDescription className="line-clamp-2">
                {project.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>
                  {project.views > 0 ? `${formatViews(project.views)} views` : 'No views yet'}
                </span>
                <span>{new Date(project.createdAt).toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {projects.length === 0 && (
        <Card className="flex flex-col items-center justify-center py-12">
          <Video className="h-12 w-12 text-muted-foreground mb-4" />
          <CardTitle className="text-xl mb-2">No projects yet</CardTitle>
          <CardDescription className="text-center mb-4">
            Create your first AI-generated video project to get started.
          </CardDescription>
          <Button asChild>
            <Link href="/dashboard/projects/new">
              <Plus className="mr-2 h-4 w-4" />
              Create First Project
            </Link>
          </Button>
        </Card>
      )}
    </div>
  )
}