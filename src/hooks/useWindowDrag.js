import { useCallback, useMemo, useRef } from 'react';

const WORKAREA_PADDING = 12;
const TASKBAR_HEIGHT = 62;

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function getLimits(viewport, bounds) {
  return {
    minLeft: WORKAREA_PADDING,
    maxLeft: Math.max(WORKAREA_PADDING, viewport.width - WORKAREA_PADDING - bounds.width),
    minTop: WORKAREA_PADDING,
    maxTop: Math.max(WORKAREA_PADDING, viewport.height - TASKBAR_HEIGHT - WORKAREA_PADDING - bounds.height),
  };
}

function getCursorOffsetRatio(startX, bounds) {
  const offsetX = startX - bounds.left;
  return clamp(offsetX / bounds.width, 0.12, 0.88);
}

export function useWindowDrag({ windowItem, viewport, onFocus, onDrag, onDragStart, onDragEnd, onRestoreFromMaximize }) {
  const frameRef = useRef({ rafId: 0, pendingBounds: null, lastBounds: null });

  const flushFrame = useCallback(
    (windowId) => {
      frameRef.current.rafId = 0;

      if (frameRef.current.pendingBounds) {
        frameRef.current.lastBounds = frameRef.current.pendingBounds;
        onDrag(windowId, frameRef.current.pendingBounds);
        frameRef.current.pendingBounds = null;
      }
    },
    [onDrag],
  );

  const cleanup = useCallback(() => {
    if (frameRef.current.rafId) {
      window.cancelAnimationFrame(frameRef.current.rafId);
    }

    frameRef.current.rafId = 0;
    frameRef.current.pendingBounds = null;
    frameRef.current.lastBounds = null;
    document.body.style.userSelect = '';
    document.body.style.cursor = '';
    onDragEnd?.();
  }, [onDragEnd]);

  return useMemo(
    () => ({
      onPointerDown: (event) => {
        if (event.button !== 0 || event.target.closest('[data-window-control="true"]')) {
          return;
        }

        event.preventDefault();
        event.stopPropagation();
        onFocus(windowItem.id);
        onDragStart?.();

        let startBounds = windowItem.bounds;
        let dragAnchorRatio = getCursorOffsetRatio(event.clientX, startBounds);

        if (windowItem.isMaximized) {
          const restoredBounds = onRestoreFromMaximize(windowItem.id, dragAnchorRatio, event.clientX, event.clientY);

          if (!restoredBounds) {
            cleanup();
            return;
          }

          startBounds = restoredBounds;
          dragAnchorRatio = getCursorOffsetRatio(event.clientX, restoredBounds);
        }

        const pointerOffsetY = clamp(event.clientY - startBounds.top, 12, 42);

        document.body.style.userSelect = 'none';
        document.body.style.cursor = 'grabbing';

        const pushBounds = (nextBounds) => {
          frameRef.current.pendingBounds = nextBounds;

          if (frameRef.current.rafId) {
            return;
          }

          frameRef.current.rafId = window.requestAnimationFrame(() => flushFrame(windowItem.id));
        };

        const handlePointerMove = (moveEvent) => {
          const limits = getLimits(viewport, startBounds);
          const nextLeft = clamp(moveEvent.clientX - startBounds.width * dragAnchorRatio, limits.minLeft, limits.maxLeft);
          const nextTop = clamp(moveEvent.clientY - pointerOffsetY, limits.minTop, limits.maxTop);

          pushBounds({
            left: nextLeft,
            top: nextTop,
            width: startBounds.width,
            height: startBounds.height,
          });
        };

        const handlePointerUp = () => {
          window.removeEventListener('pointermove', handlePointerMove);
          window.removeEventListener('pointerup', handlePointerUp);

          if (frameRef.current.rafId) {
            window.cancelAnimationFrame(frameRef.current.rafId);
            flushFrame(windowItem.id);
          }

          cleanup();
        };

        window.addEventListener('pointermove', handlePointerMove);
        window.addEventListener('pointerup', handlePointerUp);
      },
    }),
    [cleanup, flushFrame, onDragStart, onFocus, onRestoreFromMaximize, viewport, windowItem],
  );
}
