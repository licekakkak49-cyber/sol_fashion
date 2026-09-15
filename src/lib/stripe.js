import { loadStripe } from '@stripe/stripe-js';

// Get public Stripe key from environment
export const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '';

// Validate that it's a real user-supplied Stripe publishable key (starts with pk_test_ or pk_live_ and isn't the revoked dummy key)
export const isStripeConfigured = Boolean(
  STRIPE_PUBLISHABLE_KEY && 
  (STRIPE_PUBLISHABLE_KEY.startsWith('pk_test_') || STRIPE_PUBLISHABLE_KEY.startsWith('pk_live_')) &&
  !STRIPE_PUBLISHABLE_KEY.includes('51BTUDGJAJfZb9HEBwDg86TN1KN')
);

// Only initialize Stripe JS if a valid key is present, preventing "Invalid API Key provided" error
export const stripePromise = isStripeConfigured ? loadStripe(STRIPE_PUBLISHABLE_KEY) : null;

// Jacquemus-inspired Minimal Luxury Stripe Elements Styling
export const stripeElementOptions = {
  style: {
    base: {
      fontSize: '14px',
      color: 'rgb(30, 30, 30)',
      fontFamily: "'Futura PT', 'Helvetica Neue', Arial, sans-serif",
      letterSpacing: '0.03em',
      fontSmoothing: 'antialiased',
      '::placeholder': {
        color: '#8E9196',
      },
    },
    invalid: {
      color: '#dc2626',
      iconColor: '#dc2626',
    },
  },
};
