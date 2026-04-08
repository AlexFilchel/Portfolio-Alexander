import { useEffect, useState } from 'react';

function getViewportSize() {
  if (typeof window === 'undefined') {
    return { width: 1440, height: 900 };
  }

  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
}

export function useViewportSize() {
  const [viewport, setViewport] = useState(getViewportSize);

  useEffect(() => {
    let frameId = 0;

    function handleResize() {
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }

      frameId = window.requestAnimationFrame(() => {
        setViewport((currentViewport) => {
          const nextViewport = getViewportSize();

          if (currentViewport.width === nextViewport.width && currentViewport.height === nextViewport.height) {
            return currentViewport;
          }

          return nextViewport;
        });
      });
    }

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }

      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return viewport;
}
