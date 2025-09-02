export default function CookiePolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Cookie Policy</h1>
      <div className="text-sm text-gray-600 mb-8">Last updated: January 2025</div>
      
      <div className="prose prose-lg max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">What Are Cookies</h2>
          <p className="text-gray-700">
            Cookies are small text files that are stored on your computer or mobile device when you visit our website. 
            They allow us to recognize you and remember your preferences to provide you with a better experience.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">How We Use Cookies</h2>
          <p className="text-gray-700 mb-4">We use cookies for the following purposes:</p>
          
          <div className="mb-6">
            <h3 className="text-xl font-medium mb-3 text-gray-900">Essential Cookies</h3>
            <p className="text-gray-700 mb-3">These cookies are necessary for the website to function properly:</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Authentication and login state</li>
              <li>Security and fraud prevention</li>
              <li>Shopping cart and checkout process</li>
              <li>Load balancing</li>
            </ul>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-medium mb-3 text-gray-900">Analytical Cookies</h3>
            <p className="text-gray-700 mb-3">These help us understand how visitors interact with our website:</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Google Analytics (traffic analysis)</li>
              <li>Page view tracking</li>
              <li>User behavior analysis</li>
              <li>Performance monitoring</li>
            </ul>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-medium mb-3 text-gray-900">Marketing Cookies</h3>
            <p className="text-gray-700 mb-3">Used to track visitors across websites for advertising purposes:</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Affiliate tracking (90-day duration)</li>
              <li>Conversion tracking</li>
              <li>Retargeting campaigns</li>
              <li>Social media integration</li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Third-Party Cookies</h2>
          <p className="text-gray-700 mb-4">We also use third-party services that may set cookies:</p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li><strong>Stripe:</strong> Payment processing and fraud prevention</li>
            <li><strong>Google Analytics:</strong> Website analytics and performance</li>
            <li><strong>Vercel:</strong> Website hosting and performance</li>
            <li><strong>NextAuth:</strong> Authentication services</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Managing Your Cookie Preferences</h2>
          <p className="text-gray-700 mb-4">
            You can control and manage cookies in several ways:
          </p>
          
          <div className="bg-gray-50 p-6 rounded-lg mb-6">
            <h3 className="text-lg font-medium mb-3">Browser Settings</h3>
            <p className="text-gray-700 mb-3">
              Most browsers allow you to control cookies through their settings:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-gray-700">
              <li>Block all cookies</li>
              <li>Block third-party cookies</li>
              <li>Delete cookies when you close the browser</li>
              <li>Get notifications when cookies are set</li>
            </ul>
          </div>

          <div className="bg-blue-50 p-6 rounded-lg mb-6">
            <h3 className="text-lg font-medium mb-3">Cookie Consent Manager</h3>
            <p className="text-gray-700 mb-4">
              Use our cookie consent tool to customize your preferences:
            </p>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Manage Cookie Preferences
            </button>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Impact of Disabling Cookies</h2>
          <p className="text-gray-700 mb-4">
            Please note that disabling certain cookies may impact your experience:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>You may need to log in repeatedly</li>
            <li>Some features may not work properly</li>
            <li>Your preferences will not be saved</li>
            <li>We cannot provide personalized experiences</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Updates to This Policy</h2>
          <p className="text-gray-700">
            We may update this Cookie Policy from time to time. Any changes will be posted on this page 
            with an updated revision date.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
          <p className="text-gray-700">
            If you have questions about our use of cookies, please contact us at 
            <a href="mailto:privacy@clipforge.ai" className="text-blue-600 hover:underline"> privacy@clipforge.ai</a>
          </p>
        </section>
      </div>
    </div>
  )
}
