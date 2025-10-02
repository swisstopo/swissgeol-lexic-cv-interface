import { useState, useEffect } from 'react';

// Valore di riferimento usato in Figma
export const DEFAULT_BASE_MAIN_WIDTH = 1496;

/**
 * Hook che restituisce la larghezza del main calcolata client-side
 * @param baseWidth - Larghezza di riferimento del main (default: DEFAULT_BASE_MAIN_WIDTH)
 * @returns La larghezza del main attuale
 */
export const useMainWidth = (baseWidth: number = DEFAULT_BASE_MAIN_WIDTH): number => {
  const [mainWidth, setMainWidth] = useState<number>(baseWidth);

  useEffect(() => {
    const updateMainWidth = () => {
      const mainElement = document.querySelector('main');
      if (mainElement) {
        setMainWidth(mainElement.offsetWidth);
      }
    };

    // Esegui al mount
    updateMainWidth();
    
    // Aggiungi listener per resize
    window.addEventListener('resize', updateMainWidth);
    
    // Cleanup
    return () => window.removeEventListener('resize', updateMainWidth);
  }, []);

  return mainWidth;
};

/**
 * Calcola la dimensione in pixel basandosi sui pixel di riferimento rispetto alla larghezza del main
 * @param pixels - I pixel di riferimento (es: 773 per un elemento che dovrebbe essere 773px su base=1496)
 * @param mainWidth - Larghezza del main attuale (OBBLIGATORIO)
 * @param base - (opzionale) larghezza di riferimento del main (default: DEFAULT_BASE_MAIN_WIDTH)
 * @returns La dimensione in pixel per la larghezza del main attuale, mantenendo la proporzione (arrotondata)
 */
export const calculateFromMainWidth = (
  pixels: number,
  mainWidth: number,
  base: number = DEFAULT_BASE_MAIN_WIDTH
): string => {
  // Calcola la dimensione proporzionale: (pixel_riferimento / base) * mainWidth_attuale
  // Questo mantiene la stessa proporzione rispetto alla larghezza del main
  const calculatedPixels = (pixels / base) * mainWidth;

  // Arrotonda a pixel interi
  return `${Math.round(calculatedPixels)}px`;
};
