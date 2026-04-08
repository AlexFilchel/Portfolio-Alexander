import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AppIcon } from '../common/AppIcon';
import { WindowControls } from './WindowControls';
import { classNames } from '../../utils/classNames';
import { useWindowResizer } from '../../hooks/useWindowResizer';
import { useWindowDrag } from '../../hooks/useWindowDrag';

const WINDOW_ANIMATION_DURATION = {
  open: 235,
  restore: 205,
  close: 190,
  minimize: 220,
};

function getTaskbarTransform(bounds, targetRect) {
  if (!targetRect) {
    return 'translate3d(0, 40px, 0) scale(0.88)';
  }

  const windowCenterX = bounds.left + bounds.width / 2;
  const windowCenterY = bounds.top + bounds.height / 2;
  const targetCenterX = targetRect.left + targetRect.width / 2;
  const targetCenterY = targetRect.top + targetRect.height / 2;
  const scale = Math.max(0.14, Math.min(0.26, targetRect.width / bounds.width));

  return `translate3d(${Math.round(targetCenterX - windowCenterX)}px, ${Math.round(targetCenterY - windowCenterY)}px, 0) scale(${scale})`;
}

const resizeHandleClassMap = {
  n: 'left-3 right-3 top-0 h-1.5 cursor-ns-resize',
  s: 'bottom-0 left-3 right-3 h-1.5 cursor-ns-resize',
  e: 'bottom-3 right-0 top-3 w-1.5 cursor-ew-resize',
  w: 'bottom-3 left-0 top-3 w-1.5 cursor-ew-resize',
  ne: 'right-0 top-0 h-3.5 w-3.5 cursor-ne-resize',
  nw: 'left-0 top-0 h-3.5 w-3.5 cursor-nw-resize',
  se: 'bottom-0 right-0 h-3.5 w-3.5 cursor-se-resize',
  sw: 'bottom-0 left-0 h-3.5 w-3.5 cursor-sw-resize',
};

export function WindowFrame({
  windowItem,
  isActive,
  children,
  onFocus,
  onClose,
  onAnimationComplete,
  onMinimize,
  onToggleMaximize,
  onUpdateBounds,
  onRestoreFromMaximize,
  taskbarTargetRect,
  viewport,
}) {
  const [isInteracting, setIsInteracting] = useState(false);
  const [isOpeningVisible, setIsOpeningVisible] = useState(windowItem.animationState !== 'opening');
  const [previewBounds, setPreviewBounds] = useState(null);
  const previewBoundsRef = useRef(null);
  const isDialog = windowItem.windowVariant === 'dialog';
  const isOpening = windowItem.animationState === 'opening';
  const isClosing = windowItem.animationState === 'closing';
  const isMinimizing = windowItem.animationState === 'minimizing';
  const isAnimating = isOpening || isClosing || isMinimizing;
  const canInteract = windowItem.animationState === 'open';

  useEffect(() => {
    previewBoundsRef.current = null;
    setPreviewBounds(null);
  }, [windowItem.animationState, windowItem.bounds.height, windowItem.bounds.left, windowItem.bounds.top, windowItem.bounds.width, windowItem.isMaximized, windowItem.isMinimized]);

  useEffect(() => {
    if (!isOpening) {
      setIsOpeningVisible(true);
      return undefined;
    }

    setIsOpeningVisible(false);

    const frameId = window.requestAnimationFrame(() => {
      setIsOpeningVisible(true);
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [isOpening, windowItem.animationOrigin]);

  useEffect(() => {
    if (!isAnimating) {
      return undefined;
    }

    const duration = isOpening
      ? windowItem.animationOrigin === 'taskbar'
        ? WINDOW_ANIMATION_DURATION.restore
        : WINDOW_ANIMATION_DURATION.open
      : isMinimizing
        ? WINDOW_ANIMATION_DURATION.minimize
        : WINDOW_ANIMATION_DURATION.close;

    const timeoutId = window.setTimeout(() => {
      onAnimationComplete(windowItem.id, windowItem.animationState);
    }, duration);

    return () => window.clearTimeout(timeoutId);
  }, [isAnimating, isClosing, isMinimizing, isOpening, onAnimationComplete, windowItem.animationOrigin, windowItem.animationState, windowItem.id]);

  const handlePreviewBounds = useCallback((bounds) => {
    previewBoundsRef.current = bounds;
    setPreviewBounds(bounds);
  }, []);

  const handleInteractionEnd = useCallback(() => {
    if (previewBoundsRef.current) {
      onUpdateBounds(windowItem.id, previewBoundsRef.current);
    }

    previewBoundsRef.current = null;
    setPreviewBounds(null);
    setIsInteracting(false);
  }, [onUpdateBounds, windowItem.id]);

  const visibleBounds = previewBounds ?? windowItem.bounds;
  const taskbarTransform = getTaskbarTransform(visibleBounds, taskbarTargetRect);
  const animationTransform = isOpening
    ? isOpeningVisible
      ? 'translate3d(0, 0, 0) scale(1)'
      : windowItem.animationOrigin === 'taskbar'
        ? taskbarTransform
        : 'translate3d(0, 12px, 0) scale(0.96)'
    : isMinimizing
      ? taskbarTransform
      : isClosing
        ? 'translate3d(0, 10px, 0) scale(0.96)'
        : 'translate3d(0, 0, 0) scale(1)';
  const animationOpacity = isOpening
    ? isOpeningVisible ? 1 : 0
    : isMinimizing || isClosing
      ? 0
      : 1;
  const animationDuration = isOpening
    ? windowItem.animationOrigin === 'taskbar'
      ? WINDOW_ANIMATION_DURATION.restore
      : WINDOW_ANIMATION_DURATION.open
    : isMinimizing
      ? WINDOW_ANIMATION_DURATION.minimize
      : isClosing
        ? WINDOW_ANIMATION_DURATION.close
        : 90;

  const baseStyle = windowItem.isMaximized
    ? {
        left: `${visibleBounds.left}px`,
        top: `${visibleBounds.top}px`,
        width: `${visibleBounds.width}px`,
        height: `${visibleBounds.height}px`,
      }
    : {
        width: `${visibleBounds.width}px`,
        height: `${visibleBounds.height}px`,
        left: `${visibleBounds.left}px`,
        top: `${visibleBounds.top}px`,
      };

  const resizeHandles = useWindowResizer({
    windowItem,
    viewport,
    onFocus,
    onResize: (_, bounds) => handlePreviewBounds(bounds),
    onResizeStart: () => setIsInteracting(true),
    onResizeEnd: handleInteractionEnd,
  });

  const dragHandle = useWindowDrag({
    windowItem,
    viewport,
    onFocus,
    onDrag: (_, bounds) => handlePreviewBounds(bounds),
    onDragStart: () => setIsInteracting(true),
    onDragEnd: handleInteractionEnd,
    onRestoreFromMaximize,
  });

  const frameClassName = useMemo(
    () =>
      classNames(
        'absolute flex origin-bottom flex-col overflow-hidden border border-white/55 bg-[rgba(247,249,252,0.82)] shadow-[0_30px_60px_rgba(15,23,42,0.26)] backdrop-blur-2xl transform-gpu',
        isDialog ? 'rounded-[22px]' : windowItem.isMaximized ? 'rounded-[12px]' : 'rounded-[20px]',
        isMinimizing || isClosing ? 'pointer-events-none' : 'pointer-events-auto',
        isDialog ? 'ring-1 ring-white/65' : isActive ? 'ring-1 ring-sky-400/40' : 'ring-1 ring-slate-300/40',
        isInteracting ? 'transition-none' : 'transition-[opacity,transform,box-shadow] duration-90 ease-out',
      ),
    [isActive, isClosing, isDialog, isInteracting, isMinimizing, windowItem.isMaximized],
  );

  if (!windowItem.isOpen || windowItem.animationState === 'minimized') {
    return null;
  }

  return (
    <article
      style={{
        ...baseStyle,
        opacity: animationOpacity,
        pointerEvents: isMinimizing || isClosing ? 'none' : undefined,
        transform: animationTransform,
        transitionDuration: `${animationDuration}ms`,
        willChange: isInteracting || isAnimating ? 'transform, opacity' : undefined,
        zIndex: windowItem.zIndex,
      }}
      onMouseDown={() => onFocus(windowItem.id)}
      className={frameClassName}
      role={isDialog ? 'dialog' : undefined}
      aria-modal={isDialog ? 'true' : undefined}
    >
      <div
        {...(isDialog || !canInteract ? {} : dragHandle)}
        onDoubleClick={() => {
          if (canInteract && windowItem.allowMaximize) {
            onToggleMaximize(windowItem.id);
          }
        }}
        className={classNames(
          'flex items-center justify-between border-b border-white/65 bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(244,247,252,0.78))] backdrop-blur',
          isDialog ? 'pl-4' : canInteract ? 'cursor-grab pl-4 md:pl-5' : 'pl-4 md:pl-5',
        )}
        style={{ touchAction: 'none' }}
      >
        <div className={classNames('flex min-w-0 items-center gap-3.5', isDialog ? 'py-2.5' : 'py-3')}>
          <AppIcon icon={windowItem.iconSrc ?? windowItem.icon} frameClassName="h-10 w-10 rounded-[14px] border-slate-200/80 bg-white/92 p-[2px] shadow-none" />
          <div className="min-w-0">
            <p className="truncate text-[13px] font-medium tracking-[0.01em] text-slate-900">{windowItem.title}</p>
            <p className="truncate text-[11px] text-slate-500">Alexander Filchel</p>
          </div>
        </div>

        <WindowControls
          allowMaximize={windowItem.allowMaximize}
          allowMinimize={windowItem.allowMinimize}
          isMaximized={windowItem.isMaximized}
          onMinimize={() => onMinimize(windowItem.id)}
          onToggleMaximize={() => onToggleMaximize(windowItem.id)}
          onClose={() => onClose(windowItem.id)}
        />
      </div>

      <div className={classNames('scrollbar-subtle flex-1 overflow-auto bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(246,248,252,0.96)_100%)]', isDialog ? 'p-4' : 'p-4 md:p-5')}>
        {children}
      </div>

      {!isDialog && !windowItem.isMaximized && windowItem.allowResize && canInteract &&
        resizeHandles.map((handle) => (
          <span
            key={handle.direction}
            className={classNames('absolute z-20 block bg-transparent', resizeHandleClassMap[handle.direction])}
            onPointerDown={handle.onPointerDown}
          />
        ))}
    </article>
  );
}
