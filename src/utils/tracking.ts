// Facebook Pixel tracking utilities
declare global {
  interface Window {
    fbq?: (action: string, event: string, data?: any) => void;
  }
}

export const trackPurchase = (value: number, currency: string = 'BRL') => {
  try {
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'Purchase', {
        value: value,
        currency: currency
      });
      console.log(`[Facebook Pixel] Purchase tracked: ${value} ${currency}`);
    } else {
      console.warn('[Facebook Pixel] fbq not available');
    }
  } catch (error) {
    console.error('[Facebook Pixel] Error tracking Purchase:', error);
  }
};
