import { useEffect } from 'react';

declare global {
  interface Window {
    clarity?: (...args: unknown[]) => void;
  }
}

export function Clarity(): null {
  useEffect(() => {
    if (typeof window === 'undefined' || window.clarity) return;

    (function (
      c: Record<string, unknown>,
      l: Document,
      a: string,
      r: string,
      i: string,
      t?: HTMLScriptElement,
      y?: Element
    ) {
      c[a] =
        c[a] ||
        function (...args: unknown[]) {
          ((c[a] as { q?: unknown[] }).q = (c[a] as { q?: unknown[] }).q || []).push(args);
        };
      t = l.createElement(r) as HTMLScriptElement;
      t.async = true;
      t.src = 'https://www.clarity.ms/tag/' + i;
      y = l.getElementsByTagName(r)[0];
      y.parentNode?.insertBefore(t, y);
    })(window as unknown as Record<string, unknown>, document, 'clarity', 'script', 'u0c70jph9n');
  }, []);

  return null;
}
