import { useState, useEffect } from 'react';

// Reference value used in Figma
export const DEFAULT_BASE_MAIN_WIDTH = 1496;

/**
 * Hook that returns the main element width calculated client-side
 * @param baseWidth - Reference width of the main element (default: DEFAULT_BASE_MAIN_WIDTH)
 * @returns The current main element width
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

    // Run on mount
    updateMainWidth();
    
    // Add resize listener
    window.addEventListener('resize', updateMainWidth);
    
    // Cleanup
    return () => window.removeEventListener('resize', updateMainWidth);
  }, []);

  return mainWidth;
};

/**
 * Calculates pixel dimensions based on reference pixels relative to the main element width
 * @param pixels - Reference pixels (e.g., 773 for an element that should be 773px on base=1496)
 * @param mainWidth - Current main element width (REQUIRED)
 * @param base - (optional) Reference width of the main element (default: DEFAULT_BASE_MAIN_WIDTH)
 * @returns The pixel dimension for the current main width, maintaining proportion (rounded)
 */
export const calculateFromMainWidth = (
  pixels: number,
  mainWidth: number,
  base: number = DEFAULT_BASE_MAIN_WIDTH
): string => {
  // Calculate proportional size: (reference_pixels / base) * current_mainWidth
  // This keeps the same proportion relative to main width
  const calculatedPixels = (pixels / base) * mainWidth;

  // Round to whole pixels
  return `${Math.round(calculatedPixels)}px`;
};
