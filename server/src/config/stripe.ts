import Stripe from 'stripe';
import { env } from './env.js';

const stripeKey = process.env.STRIPE_SECRET_KEY || '';

if (!stripeKey || stripeKey === 'sk_test_mock_key') {
  console.warn('⚠️  STRIPE_SECRET_KEY is not set or is using mock key. Stripe payments will not work.');
} else {
  console.log('✅ Stripe initialized with key:', stripeKey.slice(0, 12) + '...' + stripeKey.slice(-4));
}

export const stripe = new Stripe(stripeKey, {
  apiVersion: '2025-01-27.acacia' as any,
});

export const getStripeStatus = () => {
  return env.NODE_ENV;
};
