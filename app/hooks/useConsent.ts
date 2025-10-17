/**
 * Custom hook for managing Google Analytics consent
 * Handles consent state, cookie persistence, and disclaimer visibility
 */

import { useState, useEffect, useCallback } from 'react';
import {
  hasConsentedBefore,
  getConsentPreference,
  saveConsentPreference,
  shouldShowDisclaimer
} from '../lib/cookieUtils';
import { googleAnalytics } from '../lib/googleAnalytics';

interface ConsentState {
  hasConsented: boolean;
  consentGiven: boolean;
  showDisclaimer: boolean;
}

interface UseConsentReturn extends ConsentState {
  acceptConsent: (consent: boolean) => void;
  resetConsent: () => void;
}

/**
 * Hook for managing consent state and Google Analytics integration
 */
export function useConsent(): UseConsentReturn {
  const [consentState, setConsentState] = useState<ConsentState>({
    hasConsented: false,
    consentGiven: false,
    showDisclaimer: false
  });
  const [gaId, setGaId] = useState<string | null>(null);

  /**
   * Initialize consent state from cookies
   */
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch('/api/ga-id', { cache: 'no-store' });
        const data = await res.json();
        const id = typeof data?.gaId === 'string' && data.gaId ? (data.gaId as string) : null;
        if (!active) return;
        setGaId(id);

        const existingPreference = getConsentPreference();

        if (existingPreference) {
          setConsentState({
            hasConsented: true,
            consentGiven: existingPreference.consentGiven,
            showDisclaimer: false
          });

          // Configure Google Analytics with existing consent (only if GA ID exists)
          if (id && existingPreference.consentGiven) {
            googleAnalytics.configure(id);
            googleAnalytics.setConsent(true);
          }
        } else {
          // Show disclaimer for new users only if GA is configured
          const shouldShow = shouldShowDisclaimer();
          setConsentState(prev => ({
            ...prev,
            showDisclaimer: shouldShow && Boolean(id)
          }));
        }
      } catch {
        if (!active) return;
        // On error fetching GA ID, do not show disclaimer
        setGaId(null);
        setConsentState(prev => ({ ...prev, showDisclaimer: false }));
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  /**
   * Accept or decline consent and handle Google Analytics accordingly
   */
  const acceptConsent = useCallback((consent: boolean) => {
    // Update local state
    setConsentState({
      hasConsented: true,
      consentGiven: consent,
      showDisclaimer: false
    });

    // Only persist and configure GA if an ID is available
    if (gaId) {
      saveConsentPreference(consent);
      googleAnalytics.configure(gaId);
      googleAnalytics.setConsent(consent);
    }
  }, [gaId]);

  /**
   * Reset consent (for testing or user preference changes)
   */
  const resetConsent = useCallback(() => {
    // Clear consent cookie
    const existingPreference = getConsentPreference();
    if (existingPreference) {
      // Reset Google Analytics state
      googleAnalytics.setConsent(false);

      // Clear consent state. Only show disclaimer if GA ID exists
      setConsentState({
        hasConsented: false,
        consentGiven: false,
        showDisclaimer: Boolean(gaId)
      });
    }
  }, [gaId]);

  return {
    ...consentState,
    acceptConsent,
    resetConsent
  };
}
