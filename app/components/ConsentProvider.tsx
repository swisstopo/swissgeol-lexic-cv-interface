/**
 * Consent provider component for Google Analytics integration
 * Manages global consent state and disclaimer modal visibility
 */

'use client';

import React from 'react';
import { useConsent } from '../hooks/useConsent';
import DisclaimerModal from './DisclaimerModal';

interface ConsentProviderProps {
  children: React.ReactNode;
}

/**
 * Provider component that manages Google Analytics consent globally
 */
const ConsentProvider: React.FC<ConsentProviderProps> = ({ children }) => {
  const { showDisclaimer, acceptConsent } = useConsent();

  const handleAccept = (hasConsent: boolean) => {
    acceptConsent(hasConsent);
  };

  return (
    <>
      {children}
      {showDisclaimer && (
        <DisclaimerModal
          isOpen={showDisclaimer}
          onAccept={handleAccept}
        />
      )}
    </>
  );
};

export default ConsentProvider;
