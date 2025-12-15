import * as React from 'react';

export default function useDragToScroll<T extends HTMLElement>() {
  const ref = React.useRef<T>(null);
  const isDragging = React.useRef(false);
  const startX = React.useRef(0);
  const scrollLeft = React.useRef(0);

  React.useEffect(() => {
    const element = ref.current;

    if (!element) {
      return;
    }

    function handleMouseDown(e: MouseEvent) {
      if (!element) {
        return;
      }

      if (e.button !== 0) {
        return;
      }

      const target = e.target as HTMLElement;

      if (
        target.closest('button') ||
        target.closest('input') ||
        target.closest('select') ||
        target.closest('[role="button"]') ||
        target.closest('[data-radix-collection-item]')
      ) {
        return;
      }

      isDragging.current = true;
      startX.current = e.pageX - element.offsetLeft;
      scrollLeft.current = element.scrollLeft;
      element.style.cursor = 'grabbing';
      element.style.userSelect = 'none';
    }

    function handleMouseMove(e: MouseEvent) {
      if (!isDragging.current || !element) {
        return;
      }

      e.preventDefault();
      const x = e.pageX - element.offsetLeft;
      const walk = x - startX.current;

      element.scrollLeft = scrollLeft.current - walk;
    }

    function handleMouseUp() {
      if (!element) {
        return;
      }

      isDragging.current = false;
      element.style.cursor = '';
      element.style.userSelect = '';
    }

    function handleMouseLeave() {
      if (!element) {
        return;
      }

      isDragging.current = false;
      element.style.cursor = '';
      element.style.userSelect = '';
    }

    element.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return ref;
}
