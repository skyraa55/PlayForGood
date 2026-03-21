const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const supabase = require('../lib/supabase');
const router = express.Router();
router.post('/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature error:', err.message);
    return res.status(400).json({ error: 'Webhook signature verification failed' });
  }
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const userId = session.metadata?.user_id;
        const plan = session.metadata?.plan;
        if (userId && session.subscription) {
          const subscription = await stripe.subscriptions.retrieve(session.subscription);
          const endDate = new Date(subscription.current_period_end * 1000).toISOString();
          await supabase.from('users').update({
            subscription_status: 'active',
            subscription_plan: plan,
            stripe_subscription_id: session.subscription,
            subscription_end_date: endDate,
          }).eq('id', userId);
        }
        break;
      }
      case 'invoice.paid': {
        const invoice = event.data.object;
        if (invoice.subscription) {
          const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
          const endDate = new Date(subscription.current_period_end * 1000).toISOString();
          const { data: users } = await supabase
            .from('users')
            .select('id')
            .eq('stripe_subscription_id', invoice.subscription);
          if (users?.length) {
            await supabase.from('users').update({
              subscription_status: 'active',
              subscription_end_date: endDate,
            }).eq('stripe_subscription_id', invoice.subscription);
          }
        }
        break;
      }
      case 'invoice.payment_failed':
      case 'customer.subscription.deleted': {
        const obj = event.data.object;
        const subId = obj.subscription || obj.id;
        if (subId) {
          await supabase.from('users').update({ subscription_status: 'inactive' })
            .eq('stripe_subscription_id', subId);
        }
        break;
      }
      case 'customer.subscription.updated': {
        const sub = event.data.object;
        const status = sub.cancel_at_period_end ? 'cancelling' : (sub.status === 'active' ? 'active' : 'inactive');
        const endDate = new Date(sub.current_period_end * 1000).toISOString();
        await supabase.from('users').update({
          subscription_status: status,
          subscription_end_date: endDate,
        }).eq('stripe_subscription_id', sub.id);
        break;
      }
    }
    res.json({ received: true });
  } catch (err) {
    console.error('Webhook handler error:', err);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

module.exports = router;
