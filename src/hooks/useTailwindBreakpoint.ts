import { useEffect, useState } from 'react';

const breakpoints: Record<string, string> = {
  sm: '(max-width: 639px)',     // before sm
  md: '(max-width: 767px)',     // before md
  lg: '(max-width: 1023px)',    // before lg
  xl: '(max-width: 1279px)',    // before xl
  '2xl': '(max-width: 1535px)', // before 2xl
};

export function useTailwindBreakpoint(bp: keyof typeof breakpoints): boolean {
  const query = breakpoints[bp];
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (!query || typeof window === 'undefined') return;

    const media = window.matchMedia(query);
    const update = () => setMatches(media.matches);

    update(); // initial check
    media.addEventListener('change', update);

    return () => media.removeEventListener('change', update);
  }, [query]);

  return matches;
}
