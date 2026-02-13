import { loadStripe } from '@stripe/stripe-js';
import { toast } from 'react-toastify';

// Initialize Stripe with your publishable key
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export const getStripe = () => stripePromise;

// Create a checkout session for subscriptions
export const createCheckoutSession = async (
  priceId: string,
  userId: string,
  email: string
) => {
  const stripe = await getStripe();

  if (!stripe) {
    throw new Error('Stripe failed to initialize');
  }

  try {
    const response = await fetch('/api/stripe/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId,
        mode: 'subscription',
        email,
        userId,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create checkout session');
    }

    const { sessionId } = await response.json();

    // Redirect to Stripe Checkout
    const { error } = await stripe.redirectToCheckout({
      sessionId,
    });

    if (error) {
      throw error;
    }
  } catch (error: any) {
    const message = error?.message || 'Error creating checkout session';
    toast.error(message);
    throw error;
  }
};

// Create a donation session for one-time payments
export const createDonationSession = async (amountInCents: number) => {
  const stripe = await getStripe();

  if (!stripe) {
    throw new Error('Stripe failed to initialize');
  }

  try {
    const response = await fetch('/api/stripe/create-donation-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: amountInCents,
        mode: 'payment',
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create donation session');
    }

    const { sessionId } = await response.json();

    // Redirect to Stripe Checkout
    const { error } = await stripe.redirectToCheckout({
      sessionId,
    });

    if (error) {
      throw error;
    }
  } catch (error: any) {
    const message = error?.message || 'Error creating donation session';
    toast.error(message);
    throw error;
  }
};