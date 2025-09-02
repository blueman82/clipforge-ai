import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not defined')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-06-20',
  typescript: true,
})

export const getStripePublishableKey = () => {
  if (!process.env.STRIPE_PUBLIC_KEY) {
    throw new Error('STRIPE_PUBLIC_KEY is not defined')
  }
  return process.env.STRIPE_PUBLIC_KEY
}

// Stripe Price IDs for different credit packages
export const STRIPE_PRICES = {
  CREDITS_10: 'price_credits_10',
  CREDITS_50: 'price_credits_50',
  CREDITS_100: 'price_credits_100',
  CREDITS_500: 'price_credits_500',
  MONTHLY_STARTER: 'price_monthly_starter',
  MONTHLY_PRO: 'price_monthly_pro',
  YEARLY_STARTER: 'price_yearly_starter',
  YEARLY_PRO: 'price_yearly_pro',
} as const

export const CREDIT_PACKAGES = [
  {
    id: 'credits_10',
    name: '10 Credits',
    description: 'Perfect for trying out ClipForge AI',
    credits: 10,
    price: 9,
    priceId: STRIPE_PRICES.CREDITS_10,
    popular: false,
  },
  {
    id: 'credits_50',
    name: '50 Credits',
    description: 'Great for regular content creators',
    credits: 50,
    price: 39,
    priceId: STRIPE_PRICES.CREDITS_50,
    popular: true,
    savings: '20%',
  },
  {
    id: 'credits_100',
    name: '100 Credits',
    description: 'Best value for power users',
    credits: 100,
    price: 69,
    priceId: STRIPE_PRICES.CREDITS_100,
    popular: false,
    savings: '30%',
  },
  {
    id: 'credits_500',
    name: '500 Credits',
    description: 'Ultimate package for agencies',
    credits: 500,
    price: 299,
    priceId: STRIPE_PRICES.CREDITS_500,
    popular: false,
    savings: '40%',
  },
]

export const SUBSCRIPTION_PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'Perfect for individual creators',
    monthlyPrice: 29,
    yearlyPrice: 290,
    monthlyPriceId: STRIPE_PRICES.MONTHLY_STARTER,
    yearlyPriceId: STRIPE_PRICES.YEARLY_STARTER,
    features: ['100 credits/month', '1080p video exports', 'Basic templates', 'Email support'],
    popular: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'Best for growing businesses',
    monthlyPrice: 79,
    yearlyPrice: 790,
    monthlyPriceId: STRIPE_PRICES.MONTHLY_PRO,
    yearlyPriceId: STRIPE_PRICES.YEARLY_PRO,
    features: [
      '500 credits/month',
      '4K video exports',
      'Premium templates',
      'Priority support',
      'API access',
      'Custom branding',
    ],
    popular: true,
  },
]

export type CreditPackage = (typeof CREDIT_PACKAGES)[0]
export type SubscriptionPlan = (typeof SUBSCRIPTION_PLANS)[0]
