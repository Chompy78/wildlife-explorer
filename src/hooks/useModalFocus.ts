import { useEffect, type RefObject } from 'react';

const selector = 'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function useModalFocus(containerRef: RefObject<HTMLElement | null>, onClose: () => void, initialRef?: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const container = containerRef.current;
    if (!container) return;
    const activeContainer: HTMLElement = container;
    const focusables = () => Array.from(activeContainer.querySelectorAll<HTMLElement>(selector));
    (initialRef?.current ?? focusables()[0] ?? activeContainer).focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') { event.preventDefault(); onClose(); return; }
      if (event.key !== 'Tab') return;
      const items = focusables();
      if (!items.length) { event.preventDefault(); activeContainer.focus(); return; }
      const first = items[0]; const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }

    document.addEventListener('keydown', onKeyDown);
    return () => { document.removeEventListener('keydown', onKeyDown); requestAnimationFrame(() => previous?.focus()); };
  }, [containerRef, initialRef, onClose]);
}
