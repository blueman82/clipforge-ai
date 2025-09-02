import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { AdminHeader } from '@/components/AdminHeader'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Trash2, 
  Filter,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react'

// Mock job data - in real app would fetch from BullMQ/Redis
const mockJobs = [
  {
    id: 'job_1',
    type: 'script-generation',
    status: 'completed',
    progress: 100,
    projectId: 'proj_123',
    userId: 'user_456',
    createdAt: '2024-01-15T10:30:00Z',
    startedAt: '2024-01-15T10:30:05Z',
    completedAt: '2024-01-15T10:32:15Z',
    duration: 130,
    error: null,
    data: { prompt: 'Create a video about space exploration' }
  },
  {
    id: 'job_2',
    type: 'tts-generation',
    status: 'active',
    progress: 65,
    projectId: 'proj_124',
    userId: 'user_789',
    createdAt: '2024-01-15T10:35:00Z',
    startedAt: '2024-01-15T10:35:10Z',
    completedAt: null,
    duration: null,
    error: null,
    data: { voiceId: 'voice_adam', text: 'Welcome to our space journey...' }
  },
  {
    id: 'job_3',
    type: 'video-composition',
    status: 'waiting',
    progress: 0,
    projectId: 'proj_125',
    userId: 'user_101',
    createdAt: '2024-01-15T10:40:00Z',
    startedAt: null,
    completedAt: null,
    duration: null,
    error: null,
    data: { template: 'youtube-shorts', scenes: 5 }
  },
  {
    id: 'job_4',
    type: 'export',
    status: 'failed',
    progress: 45,
    projectId: 'proj_126',
    userId: 'user_202',
    createdAt: '2024-01-15T10:25:00Z',
    startedAt: '2024-01-15T10:25:08Z',
    completedAt: '2024-01-15T10:27:30Z',
    duration: 142,
    error: 'FFmpeg encoding failed: Invalid codec parameters',
    data: { resolution: '1080p', format: 'mp4' }
  }
]

function getStatusIcon(status: string) {
  switch (status) {
    case 'completed':
      return <CheckCircle className="h-4 w-4 text-green-500" />
    case 'active':
      return <Play className="h-4 w-4 text-blue-500" />
    case 'waiting':
      return <Clock className="h-4 w-4 text-yellow-500" />
    case 'failed':
      return <XCircle className="h-4 w-4 text-red-500" />
    case 'paused':
      return <Pause className="h-4 w-4 text-gray-500" />
    default:
      return <AlertCircle className="h-4 w-4 text-gray-400" />
  }
}

function getStatusBadge(status: string) {
  const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    completed: 'default',
    active: 'secondary', 
    waiting: 'outline',
    failed: 'destructive',
    paused: 'secondary'
  }
  
  return <Badge variant={variants[status] || 'outline'}>{status}</Badge>
}

export default async function AdminJobsPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user || session.user.role !== 'admin') {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen">
      <AdminHeader />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Job Queue Management</h1>
          <p className="text-muted-foreground">
            Monitor and manage background jobs across the rendering pipeline
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Jobs</p>
                  <p className="text-3xl font-bold">3</p>
                </div>
                <Play className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Waiting</p>
                  <p className="text-3xl font-bold">7</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Completed (24h)</p>
                  <p className="text-3xl font-bold">142</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Failed (24h)</p>
                  <p className="text-3xl font-bold">5</p>
                </div>
                <XCircle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Queue Controls</CardTitle>
            <CardDescription>Manage job queues and workers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh Jobs
              </Button>
              <Button variant="outline">
                <Pause className="mr-2 h-4 w-4" />
                Pause Queue
              </Button>
              <Button variant="outline">
                <Play className="mr-2 h-4 w-4" />
                Resume Queue
              </Button>
              <Button variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Clear Failed
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4" />
                <span className="text-sm font-medium">Filters:</span>
              </div>
              <Input placeholder="Search by job ID, project ID, or user" className="max-w-xs" />
              <select className="px-3 py-2 border rounded-md text-sm">
                <option value="">All Types</option>
                <option value="script-generation">Script Generation</option>
                <option value="tts-generation">TTS Generation</option>
                <option value="asset-selection">Asset Selection</option>
                <option value="video-composition">Video Composition</option>
                <option value="export">Export</option>
              </select>
              <select className="px-3 py-2 border rounded-md text-sm">
                <option value="">All Status</option>
                <option value="waiting">Waiting</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
                <option value="paused">Paused</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Jobs Table */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Jobs</CardTitle>
            <CardDescription>All jobs across the rendering pipeline</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Job ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockJobs.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell className="font-mono text-sm">{job.id}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{job.type}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(job.status)}
                        {getStatusBadge(job.status)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full transition-all duration-300"
                            style={{ width: `${job.progress}%` }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground">{job.progress}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{job.projectId}</TableCell>
                    <TableCell>
                      {job.duration ? `${Math.floor(job.duration / 60)}:${(job.duration % 60).toString().padStart(2, '0')}` : '-'}
                    </TableCell>
                    <TableCell>
                      {new Date(job.createdAt).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <RotateCcw className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}