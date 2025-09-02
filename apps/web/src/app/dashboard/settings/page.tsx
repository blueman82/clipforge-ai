'use client'

import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { 
  User, 
  Mail, 
  Key, 
  Bell,
  Shield,
  Trash2,
  Eye,
  EyeOff,
  Github,
  Chrome
} from 'lucide-react'
import { useState } from 'react'

// Mock user settings - in real app would fetch from database
const mockUserSettings = {
  profile: {
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: null,
    timezone: 'America/New_York',
    language: 'en'
  },
  notifications: {
    email: true,
    push: false,
    marketing: true,
    renderComplete: true,
    paymentFailed: true,
    weeklyReport: false
  },
  security: {
    hasPassword: true,
    connectedAccounts: {
      google: true,
      github: false
    },
    twoFactor: false,
    apiKey: 'sk_test_4eC39HqLyjWDarjtT1zdp7dc'
  },
  preferences: {
    theme: 'system',
    defaultTemplate: 'youtube-shorts',
    autoPlay: true,
    showTutorials: true
  }
}

export default async function SettingsPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    redirect('/auth/signin')
  }

  const [showApiKey, setShowApiKey] = useState(false)
  const [settings, setSettings] = useState(mockUserSettings)

  const updateNotification = (key: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: value
      }
    }))
  }

  const updatePreference = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [key]: value
      }
    }))
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="space-y-6">
          {/* Profile Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="mr-2 h-5 w-5" />
                Profile
              </CardTitle>
              <CardDescription>
                Update your personal information and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={settings.profile.name}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      profile: { ...prev.profile, name: e.target.value }
                    }))}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={settings.profile.email}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      profile: { ...prev.profile, email: e.target.value }
                    }))}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="timezone">Timezone</Label>
                  <select 
                    id="timezone" 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={settings.profile.timezone}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      profile: { ...prev.profile, timezone: e.target.value }
                    }))}
                  >
                    <option value="America/New_York">Eastern Time</option>
                    <option value="America/Chicago">Central Time</option>
                    <option value="America/Denver">Mountain Time</option>
                    <option value="America/Los_Angeles">Pacific Time</option>
                    <option value="UTC">UTC</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="language">Language</Label>
                  <select 
                    id="language" 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={settings.profile.language}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      profile: { ...prev.profile, language: e.target.value }
                    }))}
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end">
                <Button>Save Profile</Button>
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="mr-2 h-5 w-5" />
                Security
              </CardTitle>
              <CardDescription>
                Manage your account security and authentication
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Password */}
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Password</h4>
                  <p className="text-sm text-muted-foreground">
                    {settings.security.hasPassword ? 'Password is set' : 'No password set'}
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  {settings.security.hasPassword ? 'Change Password' : 'Set Password'}
                </Button>
              </div>

              {/* Connected Accounts */}
              <div>
                <h4 className="font-medium mb-3">Connected Accounts</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Chrome className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="font-medium">Google</p>
                        <p className="text-sm text-muted-foreground">
                          {settings.security.connectedAccounts.google ? 'Connected' : 'Not connected'}
                        </p>
                      </div>
                    </div>
                    <Button 
                      variant={settings.security.connectedAccounts.google ? "destructive" : "outline"} 
                      size="sm"
                    >
                      {settings.security.connectedAccounts.google ? 'Disconnect' : 'Connect'}
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Github className="h-5 w-5" />
                      <div>
                        <p className="font-medium">GitHub</p>
                        <p className="text-sm text-muted-foreground">
                          {settings.security.connectedAccounts.github ? 'Connected' : 'Not connected'}
                        </p>
                      </div>
                    </div>
                    <Button 
                      variant={settings.security.connectedAccounts.github ? "destructive" : "outline"} 
                      size="sm"
                    >
                      {settings.security.connectedAccounts.github ? 'Disconnect' : 'Connect'}
                    </Button>
                  </div>
                </div>
              </div>

              {/* API Key */}
              <div>
                <h4 className="font-medium mb-3">API Key</h4>
                <div className="flex space-x-2">
                  <Input
                    type={showApiKey ? "text" : "password"}
                    value={settings.security.apiKey}
                    readOnly
                    className="font-mono"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowApiKey(!showApiKey)}
                  >
                    {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button variant="outline" size="sm">
                    Regenerate
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Use this key to access the ClipForge API programmatically
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="mr-2 h-5 w-5" />
                Notifications
              </CardTitle>
              <CardDescription>
                Choose what notifications you want to receive
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Email Notifications</h4>
                  <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                </div>
                <Switch 
                  checked={settings.notifications.email}
                  onCheckedChange={(checked) => updateNotification('email', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Render Complete</h4>
                  <p className="text-sm text-muted-foreground">When your video is ready</p>
                </div>
                <Switch 
                  checked={settings.notifications.renderComplete}
                  onCheckedChange={(checked) => updateNotification('renderComplete', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Payment Failed</h4>
                  <p className="text-sm text-muted-foreground">When a payment fails</p>
                </div>
                <Switch 
                  checked={settings.notifications.paymentFailed}
                  onCheckedChange={(checked) => updateNotification('paymentFailed', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Marketing Updates</h4>
                  <p className="text-sm text-muted-foreground">Product updates and tips</p>
                </div>
                <Switch 
                  checked={settings.notifications.marketing}
                  onCheckedChange={(checked) => updateNotification('marketing', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Weekly Report</h4>
                  <p className="text-sm text-muted-foreground">Weekly usage summary</p>
                </div>
                <Switch 
                  checked={settings.notifications.weeklyReport}
                  onCheckedChange={(checked) => updateNotification('weeklyReport', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Preferences */}
          <Card>
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
              <CardDescription>
                Customize your ClipForge experience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Show Tutorials</h4>
                  <p className="text-sm text-muted-foreground">Display helpful tips and tutorials</p>
                </div>
                <Switch 
                  checked={settings.preferences.showTutorials}
                  onCheckedChange={(checked) => updatePreference('showTutorials', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Auto-play Videos</h4>
                  <p className="text-sm text-muted-foreground">Automatically play video previews</p>
                </div>
                <Switch 
                  checked={settings.preferences.autoPlay}
                  onCheckedChange={(checked) => updatePreference('autoPlay', checked)}
                />
              </div>

              <div>
                <Label htmlFor="default-template">Default Template</Label>
                <select 
                  id="default-template"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-2"
                  value={settings.preferences.defaultTemplate}
                  onChange={(e) => updatePreference('defaultTemplate', e.target.value)}
                >
                  <option value="youtube-shorts">YouTube Shorts</option>
                  <option value="tiktok-viral">TikTok Viral</option>
                  <option value="instagram-reels">Instagram Reels</option>
                  <option value="square-social">Square Social</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-red-200 dark:border-red-800">
            <CardHeader>
              <CardTitle className="flex items-center text-red-600 dark:text-red-400">
                <Trash2 className="mr-2 h-5 w-5" />
                Danger Zone
              </CardTitle>
              <CardDescription>
                Irreversible and destructive actions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Delete Account</h4>
                  <p className="text-sm text-muted-foreground">
                    Permanently delete your account and all associated data
                  </p>
                </div>
                <Button variant="destructive" size="sm">
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}