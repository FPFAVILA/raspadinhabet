// Utmify tracking utilities
declare global {
  interface Window {
    pixelId?: string;
    AdvancedPixelEvent?: (eventName: string, eventData?: any) => void;
  }
}

export const trackEvent = (eventName: string, eventData?: any) => {
  try {
    if (typeof window !== 'undefined' && window.AdvancedPixelEvent) {
      window.AdvancedPixelEvent(eventName, eventData);
      console.log(`[Utmify] Event tracked: ${eventName}`, eventData);
    } else {
      console.warn(`[Utmify] AdvancedPixelEvent not available for: ${eventName}`);
    }
  } catch (error) {
    console.error(`[Utmify] Error tracking ${eventName}:`, error);
  }
};

export const trackPageView = () => {
  trackEvent('PageView');
};

export const trackRegistration = (userData?: any) => {
  trackEvent('Cadastro', userData);
};

export const trackPrizeRedemption = (prizeData?: any) => {
  trackEvent('ResgateIphone', prizeData);
};

export const trackAddBalance = (amount: number) => {
  trackEvent('AddBalance', { amount });
};

export const trackPixGenerated = (amount: number, transactionId: string) => {
  trackEvent('PixGerado', { amount, transactionId });
};

export const trackScratchCard = (cardNumber: number) => {
  trackEvent('RaspadinhaRevelada', { cardNumber });
};

export const trackPrizeWon = (prizeType: string, prizeValue?: number) => {
  trackEvent('PremioGanho', { prizeType, prizeValue });
};
