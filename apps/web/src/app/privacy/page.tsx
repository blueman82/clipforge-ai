export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
      <div className="text-sm text-gray-600 mb-8">Last updated: January 2025</div>
      
      <div className="prose prose-lg max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
          <p className="text-gray-700 mb-4">
            We collect information you provide directly to us, such as when you create an account, 
            make a purchase, or contact us for support.
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>Account information (name, email address, password)</li>
            <li>Payment information (processed securely by Stripe)</li>
            <li>Content you create using our platform</li>
            <li>Communication preferences and support requests</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
          <p className="text-gray-700 mb-4">We use the information we collect to:</p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>Provide and improve our AI video generation services</li>
            <li>Process payments and manage subscriptions</li>
            <li>Send important updates and marketing communications</li>
            <li>Provide customer support</li>
            <li>Analyze usage patterns to improve our platform</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Information Sharing</h2>
          <p className="text-gray-700 mb-4">
            We do not sell, trade, or otherwise transfer your personal information to third parties 
            except as described in this policy:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>Service providers (Stripe for payments, hosting providers)</li>
            <li>Legal compliance and safety purposes</li>
            <li>With your explicit consent</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Data Security</h2>
          <p className="text-gray-700">
            We implement appropriate security measures to protect your personal information against 
            unauthorized access, alteration, disclosure, or destruction.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Your Rights</h2>
          <p className="text-gray-700 mb-4">You have the right to:</p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>Access your personal information</li>
            <li>Correct inaccurate information</li>
            <li>Request deletion of your information</li>
            <li>Opt-out of marketing communications</li>
            <li>Data portability</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Contact Us</h2>
          <p className="text-gray-700">
            If you have questions about this Privacy Policy, please contact us at 
            <a href="mailto:privacy@clipforge.ai" className="text-blue-600 hover:underline"> privacy@clipforge.ai</a>
          </p>
        </section>
      </div>
    </div>
  )
}
