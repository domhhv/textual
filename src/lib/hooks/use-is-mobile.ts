import useMediaQuery from '@/lib/hooks/use-media-query';

export default function useIsMobile() {
  return useMediaQuery('(max-width: 767px)', {
    initializeWithValue: false,
  });
}
