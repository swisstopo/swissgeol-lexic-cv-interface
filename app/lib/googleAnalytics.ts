/**
 * Google Analytics manager for GDPR-compliant tracking
 * Handles initialization, consent management, and event tracking
 */

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

interface QueuedEvent {
  type: 'pageview' | 'event';
  parameters: any;
}

class GoogleAnalyticsManager {
  private trackingId: string | null = null;
  private initialized: boolean = false;
  private consentGiven: boolean = false;
  private eventQueue: QueuedEvent[] = [];

  /**
   * Configure Google Analytics with tracking ID
   */
  configure(trackingId: string): void {
    if (!trackingId || !this.isValidTrackingId(trackingId)) {
      console.warn('Invalid Google Analytics tracking ID provided');
      return;
    }

    this.trackingId = trackingId;

    // Initialize if consent already given
    if (this.consentGiven) {
      this.initialize();
    }
  }

  /**
   * Initialize Google Analytics with gtag script
   */
  initialize(): void {
    if (this.initialized || !this.trackingId) {
      return;
    }

    // Load gtag script dynamically
    this.loadGtagScript();

    // Initialize dataLayer
    window.dataLayer = window.dataLayer || [];

    // Initialize gtag
    window.gtag = function() {
      window.dataLayer.push(arguments);
    };

    window.gtag('js', new Date());
    window.gtag('config', this.trackingId);

    this.initialized = true;

  }

  /**
   * Set user consent for tracking
   */
  setConsent(consent: boolean): void {
    this.consentGiven = consent;

    if (consent && this.trackingId && !this.initialized) {
      this.initialize();
    } else if (!consent && this.initialized) {
      // Disable tracking if consent withdrawn
      this.disableTracking();
    }
  }

  /**
   * Check if tracking ID is valid Google Analytics format
   */
  private isValidTrackingId(trackingId: string): boolean {
    return /^G-[A-Z0-9]{10,}$/.test(trackingId) || /^UA-\d{4,9}-\d{1,4}$/.test(trackingId);
  }

  /**
   * Load Google Tag Manager script dynamically
   */
  private loadGtagScript(): void {
    if (document.querySelector('script[src*="googletagmanager.com"]')) {
      return; // Script already loaded
    }

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${this.trackingId}`;
    document.head.appendChild(script);
  }

  /**
   * Disable tracking when consent is withdrawn
   */
  private disableTracking(): void {
    if (window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: 'denied'
      });
    }
    this.initialized = false;
  }


  /**
   * Get current consent status
   */
  getConsentStatus(): boolean {
    return this.consentGiven;
  }

  /**
   * Check if Google Analytics is initialized
   */
  isInitialized(): boolean {
    return this.initialized;
  }
}

// Export singleton instance
export const googleAnalytics = new GoogleAnalyticsManager();
