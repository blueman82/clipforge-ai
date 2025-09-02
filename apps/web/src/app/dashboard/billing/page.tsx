import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { 
  CreditCard, 
  Calendar, 
  Download, 
  Receipt, 
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign
} from 'lucide-react'

// Mock data - in real app would fetch from database
const mockBillingData = {
  currentPlan: {
    name: 'Pro Plan',
    status: 'active',
    price: 29,
    interval: 'month',
    nextBilling: '2024-02-15',
    features: ['100 credits/month', 'HD exports', 'Priority support', 'Custom templates']
  },
  credits: {
    current: 45,
    included: 100,
    purchased: 0,
    used: 55
  },
  paymentMethod: {
    type: 'card',
    last4: '4242',
    brand: 'visa',
    expiry: '12/2027'
  },
  invoices: [
    {
      id: 'inv_123',
      date: '2024-01-15',
      amount: 29,
      status: 'paid',
      description: 'Pro Plan - Monthly'
    },
    {
      id: 'inv_122',
      date: '2023-12-15', 
      amount: 29,
      status: 'paid',
      description: 'Pro Plan - Monthly'
    },
    {
      id: 'inv_121',
      date: '2023-11-15',
      amount: 50,
      status: 'paid',
      description: 'Credit Pack - 100 credits'
    }
  ],
  usage: {
    thisMonth: 55,
    lastMonth: 78,
    avgPerMonth: 67
  }
}

export default async function BillingPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    redirect('/auth/signin')
  }

  const { currentPlan, credits, paymentMethod, invoices, usage } = mockBillingData

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Billing & Usage</h1>
          <p className="text-muted-foreground">
            Manage your subscription, credits, and billing information
          </p>
        </div>

        <div className="grid gap-6">
          {/* Current Plan */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <CreditCard className="mr-2 h-5 w-5" />
                    Current Plan
                  </CardTitle>
                  <Badge variant={currentPlan.status === 'active' ? 'default' : 'secondary'}>
                    {currentPlan.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-2xl font-bold">{currentPlan.name}</h3>
                    <p className="text-muted-foreground">
                      ${currentPlan.price}/{currentPlan.interval}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    {currentPlan.features.map((feature, index) => (
                      <div key={index} className="flex items-center text-sm">
                        <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                        {feature}
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="mr-2 h-4 w-4" />
                    Next billing: {new Date(currentPlan.nextBilling).toLocaleDateString()}
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button size="sm">Manage Plan</Button>
                    <Button variant="outline" size="sm">Cancel</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Credits Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="mr-2 h-5 w-5" />
                  Credits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-2xl font-bold">{credits.current}</span>
                      <span className="text-sm text-muted-foreground">
                        of {credits.included + credits.purchased}
                      </span>
                    </div>
                    <Progress value={(credits.current / (credits.included + credits.purchased)) * 100} />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Included</p>
                      <p className="font-semibold">{credits.included}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Purchased</p>
                      <p className="font-semibold">{credits.purchased}</p>
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <Button size="sm" className="w-full">Buy More Credits</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Usage Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Usage Statistics</CardTitle>
              <CardDescription>Your credit usage over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold">{usage.thisMonth}</div>
                  <div className="text-sm text-muted-foreground">This Month</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{usage.lastMonth}</div>
                  <div className="text-sm text-muted-foreground">Last Month</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{usage.avgPerMonth}</div>
                  <div className="text-sm text-muted-foreground">Avg/Month</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="mr-2 h-5 w-5" />
                Payment Method
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-blue-800 rounded flex items-center justify-center">
                    <span className="text-white text-xs font-bold">
                      {paymentMethod.brand.toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium">•••• •••• •••• {paymentMethod.last4}</div>
                    <div className="text-sm text-muted-foreground">
                      Expires {paymentMethod.expiry}
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm">Update</Button>
              </div>
            </CardContent>
          </Card>

          {/* Billing History */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Receipt className="mr-2 h-5 w-5" />
                  Billing History
                </CardTitle>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {invoices.map((invoice) => (
                  <div key={invoice.id} className="flex items-center justify-between py-3 border-b last:border-0">
                    <div>
                      <div className="font-medium">{invoice.description}</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(invoice.date).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <div className="font-medium">${invoice.amount}</div>
                        <Badge 
                          variant={invoice.status === 'paid' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {invoice.status}
                        </Badge>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Billing Alerts */}
          <Card className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950">
            <CardContent className="pt-6">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                    Low Credit Warning
                  </p>
                  <p className="text-sm text-amber-700 dark:text-amber-300">
                    You have {credits.current} credits remaining. Consider purchasing more credits to avoid interruption.
                  </p>
                  <Button size="sm" className="mt-2">
                    Buy Credits
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}