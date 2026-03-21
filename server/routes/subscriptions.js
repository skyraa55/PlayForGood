const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const supabase = require('../lib/supabase');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

const PLANS = {
  monthly: {
    price_id: process.env.STRIPE_MONTHLY_PRICE_ID,
    amount: 999, // £9.99 in pence
    interval: 'month',
  },
  yearly: {
    price_id: process.env.STRIPE_YEARLY_PRICE_ID,
    amount: 8999, // £89.99
    interval: 'year',
  },
};

// POST /api/subscriptions/checkout - Create Stripe checkout session
router.post('/checkout', authenticate, async (req, res) => {
  try {
    const { plan } = req.body;
    if (!PLANS[plan]) return res.status(400).json({ error: 'Invalid plan. Use monthly or yearly' });

    const planData = PLANS[plan];
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';

    // If user has no Stripe customer, create one
    let customerId = req.user.stripe_customer_id;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: req.user.email,
        name: req.user.name,
        metadata: { user_id: req.user.id },
      });
      customerId = customer.id;
      await supabase.from('users').update({ stripe_customer_id: customerId }).eq('id', req.user.id);
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [{
        price_data: {
          currency: 'gbp',
          product_data: { name: `Golf Charity Platform - ${plan.charAt(0).toUpperCase() + plan.slice(1)} Plan` },
          unit_amount: planData.amount,
          recurring: { interval: planData.interval },
        },
        quantity: 1,
      }],
      metadata: { user_id: req.user.id, plan },
      success_url: `${clientUrl}/dashboard?subscription=success`,
      cancel_url: `${clientUrl}/subscribe?cancelled=true`,
    });

    res.json({ url: session.url, session_id: session.id });
  } catch (err) {
    console.error('Checkout error:', err);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

// POST /api/subscriptions/cancel
router.post('/cancel', authenticate, async (req, res) => {
  try {
    if (!req.user.stripe_subscription_id) {
      return res.status(400).json({ error: 'No active subscription' });
    }
    await stripe.subscriptions.update(req.user.stripe_subscription_id, {
      cancel_at_period_end: true,
    });
    await supabase.from('users').update({ subscription_status: 'cancelling' }).eq('id', req.user.id);
    res.json({ message: 'Subscription will cancel at period end' });
  } catch (err) {
    console.error('Cancel error:', err);
    res.status(500).json({ error: 'Failed to cancel subscription' });
  }
});

// GET /api/subscriptions/status
router.get('/status', authenticate, async (req, res) => {
  try {
    const { data: user } = await supabase
      .from('users')
      .select('subscription_status, subscription_plan, subscription_end_date, stripe_subscription_id')
      .eq('id', req.user.id)
      .single();
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch subscription status' });
  }
});

// POST /api/subscriptions/portal - Stripe billing portal
router.post('/portal', authenticate, async (req, res) => {
  try {
    if (!req.user.stripe_customer_id) return res.status(400).json({ error: 'No customer found' });
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    const session = await stripe.billingPortal.sessions.create({
      customer: req.user.stripe_customer_id,
      return_url: `${clientUrl}/dashboard`,
    });
    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: 'Failed to open billing portal' });
  }
});

module.exports = router;
