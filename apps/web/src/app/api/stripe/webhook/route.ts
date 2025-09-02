import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe'
import { prisma } from '@clipforge/database'
import Stripe from 'stripe'

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    const signature = headers().get('stripe-signature')!

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        await handleCheckoutCompleted(session)
        break
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionChange(subscription)
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionCanceled(subscription)
        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice
        await handlePaymentSucceeded(invoice)
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        await handlePaymentFailed(invoice)
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId
  const priceId = session.metadata?.priceId

  if (!userId || !priceId) {
    console.error('Missing metadata in checkout session')
    return
  }

  try {
    // Get price details to determine credit amount
    const price = await stripe.prices.retrieve(priceId)
    const product = await stripe.products.retrieve(price.product as string)

    // Extract credit amount from product metadata or name
    const credits = parseInt(product.metadata?.credits || '0')

    if (credits > 0) {
      // One-time credit purchase
      await prisma.$transaction([
        prisma.user.update({
          where: { id: userId },
          data: { credits: { increment: credits } },
        }),
        prisma.creditLedger.create({
          data: {
            userId,
            amount: credits,
            type: 'PURCHASE',
            description: `Purchased ${credits} credits`,
            reference: session.id,
          },
        }),
      ])
    }

    console.log(`Added ${credits} credits to user ${userId}`)
  } catch (error) {
    console.error('Error handling checkout completion:', error)
  }
}

async function handleSubscriptionChange(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string

  try {
    const customer = await stripe.customers.retrieve(customerId)
    const userId = (customer as Stripe.Customer).metadata?.userId

    if (!userId) {
      console.error('No userId found in customer metadata')
      return
    }

    // Update user subscription status
    await prisma.user.update({
      where: { id: userId },
      data: {
        stripeSubscriptionId: subscription.id,
        subscriptionStatus: subscription.status,
        subscriptionPriceId: subscription.items.data[0]?.price.id,
      },
    })

    console.log(`Updated subscription for user ${userId}: ${subscription.status}`)
  } catch (error) {
    console.error('Error handling subscription change:', error)
  }
}

async function handleSubscriptionCanceled(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string

  try {
    const customer = await stripe.customers.retrieve(customerId)
    const userId = (customer as Stripe.Customer).metadata?.userId

    if (!userId) {
      console.error('No userId found in customer metadata')
      return
    }

    // Update user subscription status
    await prisma.user.update({
      where: { id: userId },
      data: {
        subscriptionStatus: 'canceled',
      },
    })

    console.log(`Canceled subscription for user ${userId}`)
  } catch (error) {
    console.error('Error handling subscription cancelation:', error)
  }
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  // Handle recurring subscription payments
  const subscriptionId = invoice.subscription as string
  const customerId = invoice.customer as string

  try {
    const customer = await stripe.customers.retrieve(customerId)
    const userId = (customer as Stripe.Customer).metadata?.userId

    if (!userId) {
      console.error('No userId found in customer metadata')
      return
    }

    // Get subscription details to add monthly credits
    const subscription = await stripe.subscriptions.retrieve(subscriptionId)
    const priceId = subscription.items.data[0]?.price.id

    // Determine monthly credit allocation based on plan
    let monthlyCredits = 0
    if (priceId?.includes('starter')) {
      monthlyCredits = 100
    } else if (priceId?.includes('pro')) {
      monthlyCredits = 500
    }

    if (monthlyCredits > 0) {
      await prisma.$transaction([
        prisma.user.update({
          where: { id: userId },
          data: { credits: { increment: monthlyCredits } },
        }),
        prisma.creditLedger.create({
          data: {
            userId,
            amount: monthlyCredits,
            type: 'SUBSCRIPTION',
            description: `Monthly credit allocation: ${monthlyCredits} credits`,
            reference: invoice.id,
          },
        }),
      ])
    }

    console.log(`Added ${monthlyCredits} monthly credits to user ${userId}`)
  } catch (error) {
    console.error('Error handling payment success:', error)
  }
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string

  try {
    const customer = await stripe.customers.retrieve(customerId)
    const userId = (customer as Stripe.Customer).metadata?.userId

    if (!userId) {
      console.error('No userId found in customer metadata')
      return
    }

    // Update subscription status and potentially send notification
    await prisma.user.update({
      where: { id: userId },
      data: {
        subscriptionStatus: 'past_due',
      },
    })

    console.log(`Payment failed for user ${userId}`)
  } catch (error) {
    console.error('Error handling payment failure:', error)
  }
}