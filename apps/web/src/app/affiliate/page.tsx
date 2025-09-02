import { Footer } from '@/components/layout/footer'
import { Header } from '@/components/layout/header'

export default function AffiliatePage() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        {/* Header with New Badge */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            NEW: Affiliate Program Launch
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Earn 30% Commission
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Join our affiliate program and earn recurring commissions by promoting the best AI video creation platform
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="text-center bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
            <div className="text-3xl font-bold text-blue-600 mb-2">30%</div>
            <div className="text-gray-600 dark:text-gray-300">Commission Rate</div>
          </div>
          <div className="text-center bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
            <div className="text-3xl font-bold text-green-600 mb-2">$49-299</div>
            <div className="text-gray-600 dark:text-gray-300">Avg Order Value</div>
          </div>
          <div className="text-center bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
            <div className="text-3xl font-bold text-purple-600 mb-2">90 Days</div>
            <div className="text-gray-600 dark:text-gray-300">Cookie Duration</div>
          </div>
        </div>

        {/* How it Works */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Sign Up</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Apply to join our affiliate program and get approved within 24 hours
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Promote</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Share your unique referral link and promote ClipForge AI to your audience
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Earn</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Get paid 30% commission on every sale plus recurring subscription commissions
              </p>
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 mb-16 shadow-lg">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">
            Affiliate Benefits
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-green-600 text-sm">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">High Converting Product</h3>
                  <p className="text-gray-600 dark:text-gray-300">Proven landing pages with 12% conversion rate</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-green-600 text-sm">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Marketing Materials</h3>
                  <p className="text-gray-600 dark:text-gray-300">Banners, videos, and copy ready to use</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-green-600 text-sm">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Real-time Analytics</h3>
                  <p className="text-gray-600 dark:text-gray-300">Track clicks, conversions, and earnings instantly</p>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-green-600 text-sm">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Dedicated Support</h3>
                  <p className="text-gray-600 dark:text-gray-300">Personal affiliate manager for top performers</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-green-600 text-sm">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Monthly Payouts</h3>
                  <p className="text-gray-600 dark:text-gray-300">Get paid on the 1st of every month via PayPal</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-green-600 text-sm">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Recurring Commissions</h3>
                  <p className="text-gray-600 dark:text-gray-300">Earn on every subscription renewal</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
            Ready to Start Earning?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Join hundreds of creators already earning with our affiliate program
          </p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white text-xl px-12 py-4 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg">
            Apply Now - It&apos;s Free!
          </button>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
            No application fee • Instant approval for qualified applicants
          </p>
        </div>
      </div>
    </div>
  )
}
