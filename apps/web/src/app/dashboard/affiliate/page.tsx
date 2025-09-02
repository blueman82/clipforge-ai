import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Users, 
  DollarSign, 
  Link2, 
  Copy, 
  Download,
  Eye,
  TrendingUp,
  Calendar
} from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

// Mock affiliate data - in real app would fetch from database
const mockAffiliateData = {
  stats: {
    totalClicks: 1247,
    conversions: 89,
    conversionRate: 7.14,
    totalEarnings: 534.50,
    pendingPayout: 234.75,
    paidOut: 299.75
  },
  referralCode: 'CREATOR2024',
  referralLink: 'https://clipforge-ai.com/ref/CREATOR2024',
  recentActivity: [
    { date: '2024-01-15', type: 'conversion', amount: 15.00, user: 'john.doe@example.com' },
    { date: '2024-01-14', type: 'click', amount: 0, user: 'visitor_4521' },
    { date: '2024-01-14', type: 'conversion', amount: 12.50, user: 'sarah.smith@example.com' },
    { date: '2024-01-13', type: 'click', amount: 0, user: 'visitor_8934' },
    { date: '2024-01-12', type: 'conversion', amount: 20.00, user: 'mike.jones@example.com' }
  ],
  monthlyBreakdown: [
    { month: 'Dec 2023', clicks: 423, conversions: 31, earnings: 186.50 },
    { month: 'Nov 2023', clicks: 387, conversions: 28, earnings: 168.00 },
    { month: 'Oct 2023', clicks: 312, conversions: 22, earnings: 132.00 },
    { month: 'Sep 2023', clicks: 125, conversions: 8, earnings: 48.00 }
  ]
}

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text)
}

export default async function AffiliatePage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    redirect('/auth/signin')
  }

  const { stats, referralCode, referralLink, recentActivity, monthlyBreakdown } = mockAffiliateData

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Affiliate Dashboard</h1>
              <p className="text-muted-foreground">
                Track your referrals and earnings
              </p>
            </div>
            <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              Active Affiliate
            </Badge>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Eye className="h-4 w-4 text-blue-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Clicks</p>
                  <p className="text-xl font-bold">{stats.totalClicks.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-green-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Conversions</p>
                  <p className="text-xl font-bold">{stats.conversions}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-purple-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Conv. Rate</p>
                  <p className="text-xl font-bold">{stats.conversionRate}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4 text-yellow-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Earned</p>
                  <p className="text-xl font-bold">${stats.totalEarnings}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-orange-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-xl font-bold">${stats.pendingPayout}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Download className="h-4 w-4 text-green-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Paid Out</p>
                  <p className="text-xl font-bold">${stats.paidOut}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Referral Links */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Link2 className="mr-2 h-5 w-5" />
                Your Referral Links
              </CardTitle>
              <CardDescription>
                Share these links to earn 25% commission on all paid subscriptions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="referral-code">Referral Code</Label>
                <div className="flex space-x-2">
                  <Input
                    id="referral-code"
                    value={referralCode}
                    readOnly
                    className="font-mono"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(referralCode)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div>
                <Label htmlFor="referral-link">Referral Link</Label>
                <div className="flex space-x-2">
                  <Input
                    id="referral-link"
                    value={referralLink}
                    readOnly
                    className="text-sm"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(referralLink)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Commission Structure</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• 25% of first payment from each referral</li>
                  <li>• 10% of recurring subscription payments</li>
                  <li>• Minimum $50 payout threshold</li>
                  <li>• Monthly payouts on the 1st</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest clicks and conversions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${
                        activity.type === 'conversion' ? 'bg-green-500' : 'bg-blue-500'
                      }`} />
                      <div>
                        <p className="text-sm font-medium">
                          {activity.type === 'conversion' ? 'Conversion' : 'Click'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(activity.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {activity.amount > 0 ? `$${activity.amount}` : '—'}
                      </p>
                      <p className="text-xs text-muted-foreground truncate max-w-[100px]">
                        {activity.user}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Monthly Breakdown */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Monthly Performance</CardTitle>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {monthlyBreakdown.map((month, index) => (
                <div key={index} className="grid grid-cols-4 gap-4 py-3 border-b last:border-0">
                  <div>
                    <p className="font-medium">{month.month}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Clicks</p>
                    <p className="font-medium">{month.clicks}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Conversions</p>
                    <p className="font-medium">{month.conversions}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Earnings</p>
                    <p className="font-medium">${month.earnings}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Payout Request */}
        <Card className="mt-6">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Request Payout</h3>
                <p className="text-sm text-muted-foreground">
                  You have ${stats.pendingPayout} available for payout
                </p>
              </div>
              <Button disabled={stats.pendingPayout < 50}>
                {stats.pendingPayout < 50 ? 'Minimum $50 Required' : 'Request Payout'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}