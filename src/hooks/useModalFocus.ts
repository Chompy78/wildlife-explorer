import { useEffect, useRef, type RefObject } from 'react';

const selector = 'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function useModalFocus(containerRef: RefObject<HTMLElement | null>, onClose: () => void, initialRef?: RefObject<HTMLElement | null>) {
  // Persists across React StrictMode's development-only double-invoke (mount, cleanup, mount again)
  // of this effect within the same real mount. `previous` must be captured only once - on the first
  // invocation - or the second invocation would capture the dialog's own just-focused element (set by
  // the first invocation) instead of the true pre-dialog trigger element. `generation` guards against
  // the discarded first invocation's cleanup firing its deferred restore after the second (real) one.
  const state = useRef<{ generation: number; previous: HTMLElement | null } | null>(null);
  useEffect(() => {
    if (!state.current) {
      state.current = { generation: 0, previous: document.activeElement instanceof HTMLElement ? document.activeElement : null };
    }
    state.current.generation += 1;
    const myGeneration = state.current.generation;
    const previous = state.current.previous;
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
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      requestAnimationFrame(() => { if (state.current?.generation === myGeneration) previous?.focus(); });
    };
  }, [containerRef, initialRef, onClose]);
}
