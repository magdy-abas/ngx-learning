if (typeof globalThis === 'undefined') {
  (global as any).globalThis = global;
}

const isSSR = typeof window === 'undefined';

if (isSSR) {
  const g = globalThis as any;

  g.window = g.window || {
    innerWidth: 1024,
    innerHeight: 768,
    matchMedia: () => ({ matches: false }),
    requestAnimationFrame: (cb: any) => setTimeout(cb, 16),
    cancelAnimationFrame: clearTimeout,
    addEventListener: () => {},
    removeEventListener: () => {},
    getComputedStyle: () => ({ getPropertyValue: () => '' }),
    location: { href: '', origin: '' },
  };

  if (!g.document) {
    const mockElement = {
      style: {},
      classList: { add: () => {}, remove: () => {}, contains: () => false },
      setAttribute: () => {},
      getAttribute: () => null,
      appendChild: () => mockElement,
      removeChild: () => mockElement,
      querySelector: () => mockElement,
      querySelectorAll: () => [mockElement],
      addEventListener: () => {},
      removeEventListener: () => {},
    };

    g.document = {
      ...mockElement,
      createElement: () => mockElement,
      getElementById: () => mockElement,
      body: mockElement,
      head: mockElement,
      documentElement: {
        style: {},
        lang: 'ar',
        dir: 'rtl',
        setAttribute: () => {},
        getAttribute: () => 'ar',
      },
    };
  }

  g.navigator = g.navigator || {
    userAgent: 'SSR/Angular',
    language: 'ar',
    languages: ['ar', 'en'],
    onLine: true,
  };

  const mockStorage = {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
    clear: () => {},
    length: 0,
    key: () => null,
  };

  g.localStorage = g.localStorage || mockStorage;
  g.sessionStorage = g.sessionStorage || mockStorage;

  g.HTMLElement = g.HTMLElement || class HTMLElement {};
  g.Element = g.Element || class Element {};
  g.Node = g.Node || class Node {};
  g.Event = g.Event || class Event {};

  try {
    const originalWriteValue = Object.prototype.toString;

    // Override common problematic methods
    g.Element.prototype = g.Element.prototype || {};
    g.Element.prototype.focus = g.Element.prototype.focus || (() => {});
    g.Element.prototype.blur = g.Element.prototype.blur || (() => {});
    g.Element.prototype.click = g.Element.prototype.click || (() => {});
    g.Element.prototype.scrollIntoView =
      g.Element.prototype.scrollIntoView || (() => {});
  } catch (err) {}
}

const originalSetTimeout = setTimeout;
(globalThis as any).setTimeout = (fn: any, delay: number = 0) => {
  if (isSSR && delay === 0) {
    return originalSetTimeout(fn, 1);
  }
  return originalSetTimeout(fn, delay);
};

if (isSSR) {
  const safeWriteValue = (originalFn: any) => {
    return function (this: any, value: any) {
      try {
        if (this && typeof originalFn === 'function') {
          return originalFn.call(this, value);
        }
      } catch (error) {
        console.warn('[SSR] writeValue skipped:');
      }
    };
  };

  originalSetTimeout(() => {
    try {
      const checkAndPatch = () => {
        if (typeof (globalThis as any).ng !== 'undefined') {
          console.log('[SSR] Angular detected, applying form patches');
        }
      };
      checkAndPatch();
    } catch (e) {}
  }, 100);
}
