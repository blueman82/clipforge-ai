import { Footer } from '@/components/layout/footer'
import { Header } from '@/components/layout/header'
import { Pricing } from '@/components/sections/pricing'

export default function PricingPage() {
  return (
    <>
      <Header />
      <main>
        <Pricing />
      </main>
      <Footer />
    </>
  )
}