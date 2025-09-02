export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
      <div className="text-sm text-gray-600 mb-8">Last updated: January 2025</div>
      
      <div className="prose prose-lg max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
          <p className="text-gray-700">
            By accessing and using ClipForge AI (&quot;Service&quot;), you accept and agree to be bound by the terms 
            and provision of this agreement. If you do not agree to abide by these terms, please do not use this service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
          <p className="text-gray-700 mb-4">
            ClipForge AI provides an AI-powered platform for creating faceless videos including:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>Automated script generation</li>
            <li>Text-to-speech conversion</li>
            <li>Video editing and composition</li>
            <li>Asset integration and management</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. User Accounts</h2>
          <p className="text-gray-700 mb-4">
            To access certain features of the Service, you must register for an account. You agree to:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>Provide accurate and complete information</li>
            <li>Maintain the security of your password</li>
            <li>Accept responsibility for all activities under your account</li>
            <li>Notify us immediately of unauthorized use</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Acceptable Use</h2>
          <p className="text-gray-700 mb-4">You agree NOT to use the Service to:</p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>Create content that is illegal, harmful, or violates third-party rights</li>
            <li>Generate misleading or false information</li>
            <li>Infringe on intellectual property rights</li>
            <li>Create spam or unsolicited content</li>
            <li>Attempt to circumvent usage limits or restrictions</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Intellectual Property</h2>
          <p className="text-gray-700 mb-4">
            You retain ownership of content you create using our Service. However, you grant us a license to:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>Process and store your content to provide the Service</li>
            <li>Use aggregated, non-personal data to improve our platform</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Payment Terms</h2>
          <p className="text-gray-700 mb-4">
            Subscription fees are billed in advance on a monthly or annual basis. Credits for video exports 
            are non-refundable once used. Subscriptions renew automatically unless cancelled.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Limitation of Liability</h2>
          <p className="text-gray-700">
            ClipForge AI shall not be liable for any indirect, incidental, special, consequential, or punitive 
            damages, or any loss of profits or revenues, whether incurred directly or indirectly.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">8. Contact Information</h2>
          <p className="text-gray-700">
            For questions about these Terms of Service, contact us at 
            <a href="mailto:legal@clipforge.ai" className="text-blue-600 hover:underline"> legal@clipforge.ai</a>
          </p>
        </section>
      </div>
    </div>
  )
}
