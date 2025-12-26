import * as React from 'react';

import useIsomorphicLayoutEffect from '@/lib/hooks/use-isomorphic-layout-effect';

type UseMediaQueryOptions = {
  defaultValue?: boolean;
  initializeWithValue?: boolean;
};

const IS_SERVER = typeof window === 'undefined';

export default function useMediaQuery(
  query: string,
  { defaultValue = false, initializeWithValue = true }: UseMediaQueryOptions = {}
): boolean {
  function getMatches(query: string) {
    if (IS_SERVER) {
      return defaultValue;
    }

    return window.matchMedia(query).matches;
  }

  const [matches, setMatches] = React.useState(() => {
    if (initializeWithValue) {
      return getMatches(query);
    }

    return defaultValue;
  });

  useIsomorphicLayoutEffect(() => {
    const matchMedia = window.matchMedia(query);

    function handleChange() {
      setMatches(matchMedia.matches);
    }

    handleChange();

    matchMedia.addEventListener('change', handleChange);

    return () => {
      matchMedia.removeEventListener('change', handleChange);
    };
  }, [query]);

  return matches;
}
