'use client'

import { motion } from 'framer-motion'
import { Check, X } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'


const plans = [
  {
    name: 'Starter',
    description: 'Perfect for trying out ClipForge',
    monthlyPrice: 0,
    yearlyPrice: 0,
    features: [
      { text: '3 videos per month', included: true },
      { text: '720p export quality', included: true },
      { text: 'Basic templates', included: true },
      { text: 'Watermark on videos', included: true },
      { text: 'Email support', included: true },
      { text: 'Custom branding', included: false },
      { text: 'Priority rendering', included: false },
      { text: 'API access', included: false },
    ],
    cta: 'Start Free',
    popular: false,
  },
  {
    name: 'Creator',
    description: 'For serious content creators',
    monthlyPrice: 29,
    yearlyPrice: 290,
    features: [
      { text: '100 videos per month', included: true },
      { text: '1080p export quality', included: true },
      { text: 'All premium templates', included: true },
      { text: 'No watermark', included: true },
      { text: 'Priority support', included: true },
      { text: 'Custom branding', included: true },
      { text: 'Priority rendering', included: true },
      { text: 'API access', included: false },
    ],
    cta: 'Start Trial',
    popular: true,
  },
  {
    name: 'Business',
    description: 'For teams and agencies',
    monthlyPrice: 99,
    yearlyPrice: 990,
    features: [
      { text: 'Unlimited videos', included: true },
      { text: '4K export quality', included: true },
      { text: 'Custom templates', included: true },
      { text: 'White-label options', included: true },
      { text: 'Dedicated support', included: true },
      { text: 'Custom branding', included: true },
      { text: 'Priority rendering', included: true },
      { text: 'API access', included: true },
    ],
    cta: 'Contact Sales',
    popular: false,
  },
]

export function Pricing() {
  const [isYearly, setIsYearly] = useState(false)

  return (
    <section className="py-24 bg-muted/50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold tracking-tight sm:text-4xl"
          >
            Simple, Transparent Pricing
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-4 text-lg text-muted-foreground"
          >
            Choose the perfect plan for your content creation needs
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-8 flex items-center justify-center gap-4"
          >
            <span className={!isYearly ? 'font-semibold' : 'text-muted-foreground'}>Monthly</span>
            <Switch checked={isYearly} onCheckedChange={setIsYearly} />
            <span className={isYearly ? 'font-semibold' : 'text-muted-foreground'}>
              Yearly
              <span className="ml-2 inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                Save 20%
              </span>
            </span>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className={plan.popular ? 'border-primary shadow-lg relative' : ''}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">
                      ${isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                    </span>
                    <span className="text-muted-foreground ml-2">
                      /{isYearly ? 'year' : 'month'}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature.text} className="flex items-start gap-2">
                        {feature.included ? (
                          <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        ) : (
                          <X className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                        )}
                        <span className={feature.included ? '' : 'text-muted-foreground'}>
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full" 
                    variant={plan.popular ? 'default' : 'outline'}
                    asChild
                  >
                    <Link href={plan.name === 'Business' ? '/contact' : '/auth/signup'}>
                      {plan.cta}
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}