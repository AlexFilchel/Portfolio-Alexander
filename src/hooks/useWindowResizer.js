import { useCallback, useMemo, useRef } from 'react';

const WORKAREA_PADDING = 12;
const TASKBAR_HEIGHT = 62;

function getLimits(viewport) {
  return {
    left: WORKAREA_PADDING,
    top: WORKAREA_PADDING,
    right: viewport.width - WORKAREA_PADDING,
    bottom: viewport.height - TASKBAR_HEIGHT - WORKAREA_PADDING,
  };
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function useWindowResizer({ windowItem, viewport, onFocus, onResize, onResizeStart, onResizeEnd }) {
  const frameRef = useRef({ rafId: 0, pendingBounds: null, lastBounds: null });

  const flushFrame = useCallback(
    (windowId) => {
      frameRef.current.rafId = 0;

      if (frameRef.current.pendingBounds) {
        frameRef.current.lastBounds = frameRef.current.pendingBounds;
        onResize(windowId, frameRef.current.pendingBounds);
        frameRef.current.pendingBounds = null;
      }
    },
    [onResize],
  );

  const cleanupFrame = useCallback(() => {
    if (frameRef.current.rafId) {
      window.cancelAnimationFrame(frameRef.current.rafId);
    }

    frameRef.current.rafId = 0;
    frameRef.current.pendingBounds = null;
    frameRef.current.lastBounds = null;
    document.body.style.userSelect = '';
    document.body.style.cursor = '';
    onResizeEnd?.();
  }, [onResizeEnd]);

  return useMemo(() => {
    const directions = ['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw'];

    return directions.map((direction) => ({
      direction,
      onPointerDown: (event) => {
        if (windowItem.isMaximized) {
          return;
        }

        event.preventDefault();
        event.stopPropagation();
        onFocus(windowItem.id);
        onResizeStart?.();

        const startX = event.clientX;
        const startY = event.clientY;
        const startBounds = windowItem.bounds;
        const minWidth = windowItem.minSize.width;
        const minHeight = windowItem.minSize.height;
        const limits = getLimits(viewport);

        document.body.style.userSelect = 'none';
        document.body.style.cursor = direction.includes('n') || direction.includes('s')
          ? direction.includes('e') || direction.includes('w')
            ? `${direction}-resize`
            : 'ns-resize'
          : 'ew-resize';

        const pushBounds = (nextBounds) => {
          frameRef.current.pendingBounds = nextBounds;

          if (frameRef.current.rafId) {
            return;
          }

          frameRef.current.rafId = window.requestAnimationFrame(() => flushFrame(windowItem.id));
        };

        function handlePointerMove(moveEvent) {
          const dx = moveEvent.clientX - startX;
          const dy = moveEvent.clientY - startY;
          let nextLeft = startBounds.left;
          let nextTop = startBounds.top;
          let nextWidth = startBounds.width;
          let nextHeight = startBounds.height;

          if (direction.includes('e')) {
            nextWidth = clamp(startBounds.width + dx, minWidth, limits.right - startBounds.left);
          }

          if (direction.includes('s')) {
            nextHeight = clamp(startBounds.height + dy, minHeight, limits.bottom - startBounds.top);
          }

          if (direction.includes('w')) {
            const maxLeft = startBounds.left + startBounds.width - minWidth;
            nextLeft = clamp(startBounds.left + dx, limits.left, maxLeft);
            nextWidth = startBounds.width + (startBounds.left - nextLeft);
          }

          if (direction.includes('n')) {
            const maxTop = startBounds.top + startBounds.height - minHeight;
            nextTop = clamp(startBounds.top + dy, limits.top, maxTop);
            nextHeight = startBounds.height + (startBounds.top - nextTop);
          }

          pushBounds({
            left: nextLeft,
            top: nextTop,
            width: nextWidth,
            height: nextHeight,
          });
        }

        function cleanup() {
          window.removeEventListener('pointermove', handlePointerMove);
          window.removeEventListener('pointerup', cleanup);

          if (frameRef.current.rafId) {
            window.cancelAnimationFrame(frameRef.current.rafId);
            flushFrame(windowItem.id);
          }

          cleanupFrame();
        }

        window.addEventListener('pointermove', handlePointerMove);
        window.addEventListener('pointerup', cleanup);
      },
    }));
  }, [cleanupFrame, flushFrame, frameRef, onFocus, onResizeStart, viewport, windowItem]);
}
