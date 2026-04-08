import { useEffect, useMemo, useReducer } from 'react';

const WORKAREA_PADDING = 12;
const TASKBAR_HEIGHT = 62;

function isWindowInTransition(windowItem) {
  return windowItem.animationState === 'opening'
    || windowItem.animationState === 'closing'
    || windowItem.animationState === 'minimizing';
}

function getWorkArea(viewport) {
  return {
    left: WORKAREA_PADDING,
    top: WORKAREA_PADDING,
    right: Math.max(WORKAREA_PADDING + 320, viewport.width - WORKAREA_PADDING),
    bottom: Math.max(WORKAREA_PADDING + 240, viewport.height - TASKBAR_HEIGHT - WORKAREA_PADDING),
  };
}

function getMaximizedBounds(viewport) {
  return {
    left: WORKAREA_PADDING,
    top: WORKAREA_PADDING,
    width: Math.max(320, viewport.width - WORKAREA_PADDING * 2),
    height: Math.max(240, viewport.height - WORKAREA_PADDING * 2),
  };
}

function clampBounds(bounds, minSize, viewport) {
  const area = getWorkArea(viewport);
  const availableWidth = area.right - area.left;
  const availableHeight = area.bottom - area.top;
  const width = Math.min(Math.max(bounds.width, minSize.width), availableWidth);
  const height = Math.min(Math.max(bounds.height, minSize.height), availableHeight);
  const left = Math.min(Math.max(bounds.left, area.left), area.right - width);
  const top = Math.min(Math.max(bounds.top, area.top), area.bottom - height);

  return {
    left,
    top,
    width,
    height,
  };
}

function getInitialBounds(app, viewport) {
  if (app.autoOpen && app.windowVariant === 'standard') {
    const width = app.initialWindow.width;
    const height = app.initialWindow.height;
    const autoOpenOffsetY = app.autoOpenOffsetY ?? 0;

    return clampBounds({
      left: Math.round((viewport.width - width) / 2),
      top: Math.round((viewport.height - TASKBAR_HEIGHT - height) / 2) + autoOpenOffsetY,
      width,
      height,
    }, app.minSize, viewport);
  }

  if (app.windowVariant === 'dialog') {
    const width = app.initialWindow.width;
    const height = app.initialWindow.height;

    return {
      left: Math.max(WORKAREA_PADDING, Math.round((viewport.width - width) / 2)),
      top: Math.max(WORKAREA_PADDING, Math.round((viewport.height - TASKBAR_HEIGHT - height) / 2)),
      width,
      height,
    };
  }

  return clampBounds(app.initialWindow, app.minSize, viewport);
}

function getHighestZIndex(windows) {
  return windows.reduce((highest, item) => Math.max(highest, item.zIndex), 0);
}

function getNextActiveId(windows) {
  const availableWindows = windows
    .filter((item) => item.isOpen && !item.isMinimized && item.animationState !== 'closing' && item.animationState !== 'minimizing')
    .sort((a, b) => b.zIndex - a.zIndex);

  return availableWindows[0]?.id ?? null;
}

function createInitialState({ appDefinitions, viewport }) {
  let zIndexCounter = 10;
  const autoOpenApp = appDefinitions.find((app) => app.autoOpen);

  const windows = appDefinitions.map((app) => {
    const isInitiallyOpen = Boolean(app.autoOpen);
    const bounds = getInitialBounds(app, viewport);

    if (isInitiallyOpen) {
      zIndexCounter += 1;
    }

    return {
      ...app,
      bounds,
      restoreBounds: bounds,
      isOpen: isInitiallyOpen,
      isMinimized: false,
      isMaximized: false,
      animationState: isInitiallyOpen ? 'open' : 'closed',
      animationOrigin: 'desktop',
      zIndex: isInitiallyOpen ? zIndexCounter : 1,
    };
  });

  return {
    windows,
    activeWindowId: autoOpenApp?.id ?? null,
    viewport,
  };
}

function bringToFront(state, targetId) {
  const targetWindow = state.windows.find((item) => item.id === targetId);

  if (!targetWindow) {
    return state;
  }

  const highestZIndex = getHighestZIndex(state.windows);

  if (state.activeWindowId === targetId && targetWindow.zIndex === highestZIndex) {
    return state;
  }

  const nextZIndex = highestZIndex + 1;

  return {
    ...state,
    activeWindowId: targetId,
    windows: state.windows.map((item) =>
      item.id === targetId
        ? {
            ...item,
            zIndex: nextZIndex,
          }
        : item,
    ),
  };
}

function windowReducer(state, action) {
  switch (action.type) {
    case 'OPEN_WINDOW': {
      const targetWindow = state.windows.find((item) => item.id === action.id);

      if (!targetWindow) {
        return state;
      }

      const nextState = {
        ...state,
        windows: state.windows.map((item) =>
          item.id === action.id
            ? {
                ...item,
                bounds:
                  item.windowVariant === 'dialog'
                    ? getInitialBounds(item, state.viewport)
                    : item.isMaximized
                      ? getMaximizedBounds(state.viewport)
                      : clampBounds(item.restoreBounds ?? item.bounds, item.minSize, state.viewport),
                isOpen: true,
                isMinimized: false,
                animationState: 'opening',
                animationOrigin: item.isMinimized ? 'taskbar' : 'desktop',
              }
            : item,
        ),
      };

      return bringToFront(nextState, action.id);
    }

    case 'FOCUS_WINDOW': {
      const targetWindow = state.windows.find((item) => item.id === action.id);
      if (!targetWindow || !targetWindow.isOpen || targetWindow.isMinimized || isWindowInTransition(targetWindow)) {
        return state;
      }

      return bringToFront(state, action.id);
    }

    case 'MINIMIZE_WINDOW': {
      const targetWindow = state.windows.find((item) => item.id === action.id);

      if (!targetWindow || !targetWindow.isOpen || targetWindow.isMinimized || isWindowInTransition(targetWindow)) {
        return state;
      }

      const windows = state.windows.map((item) =>
        item.id === action.id
          ? {
              ...item,
              isMinimized: true,
              animationState: 'minimizing',
            }
          : item,
      );

      return {
        ...state,
        windows,
        activeWindowId: getNextActiveId(windows),
      };
    }

    case 'TOGGLE_MAXIMIZE_WINDOW': {
      const targetWindow = state.windows.find((item) => item.id === action.id);
      if (!targetWindow || !targetWindow.isOpen || !targetWindow.allowMaximize || isWindowInTransition(targetWindow)) {
        return state;
      }

      const updatedState = {
        ...state,
        windows: state.windows.map((item) =>
          item.id === action.id
            ? {
                ...item,
                isMaximized: !item.isMaximized,
                isMinimized: false,
                bounds: item.isMaximized
                  ? clampBounds(item.restoreBounds ?? item.bounds, item.minSize, state.viewport)
                  : getMaximizedBounds(state.viewport),
                restoreBounds: item.isMaximized ? item.restoreBounds : item.bounds,
              }
            : item,
        ),
      };

      return bringToFront(updatedState, action.id);
    }

    case 'CLOSE_WINDOW': {
      const targetWindow = state.windows.find((item) => item.id === action.id);

      if (!targetWindow || !targetWindow.isOpen) {
        return state;
      }

      if (targetWindow.isMinimized || targetWindow.animationState === 'minimized') {
        const windows = state.windows.map((item) =>
          item.id === action.id
            ? {
                ...item,
                isOpen: false,
                isMinimized: false,
                isMaximized: false,
                animationState: 'closed',
                animationOrigin: 'desktop',
                bounds: clampBounds(item.restoreBounds ?? item.bounds, item.minSize, state.viewport),
              }
            : item,
        );

        return {
          ...state,
          windows,
          activeWindowId: getNextActiveId(windows),
        };
      }

      const windows = state.windows.map((item) =>
        item.id === action.id
          ? {
              ...item,
              isMinimized: false,
              animationState: 'closing',
              animationOrigin: 'desktop',
            }
          : item,
      );

      return {
        ...state,
        windows,
        activeWindowId: getNextActiveId(windows),
      };
    }

    case 'UPDATE_WINDOW_BOUNDS': {
      const targetWindow = state.windows.find((item) => item.id === action.id);

      if (!targetWindow || targetWindow.isMaximized || isWindowInTransition(targetWindow)) {
        return state;
      }

      const nextBounds = clampBounds(action.bounds, targetWindow.minSize, state.viewport);

      if (
        nextBounds.left === targetWindow.bounds.left &&
        nextBounds.top === targetWindow.bounds.top &&
        nextBounds.width === targetWindow.bounds.width &&
        nextBounds.height === targetWindow.bounds.height &&
        !targetWindow.isMinimized
      ) {
        return state;
      }

      const updatedState = {
        ...state,
        windows: state.windows.map((item) =>
          item.id === action.id
            ? {
                ...item,
                bounds: nextBounds,
                restoreBounds: nextBounds,
                isMinimized: false,
              }
            : item,
        ),
      };

      return bringToFront(updatedState, action.id);
    }

    case 'RESTORE_FROM_MAXIMIZE': {
      const targetWindow = state.windows.find((item) => item.id === action.id);

      if (!targetWindow || !targetWindow.isMaximized || isWindowInTransition(targetWindow)) {
        return state;
      }

      const fallbackBounds = clampBounds(targetWindow.restoreBounds ?? targetWindow.bounds, targetWindow.minSize, state.viewport);
      const nextBounds = clampBounds(
        {
          ...fallbackBounds,
          left: action.left,
          top: action.top,
        },
        targetWindow.minSize,
        state.viewport,
      );

      const updatedState = {
        ...state,
        windows: state.windows.map((item) =>
          item.id === action.id
            ? {
                ...item,
                isMaximized: false,
                bounds: nextBounds,
                restoreBounds: nextBounds,
              }
            : item,
        ),
      };

      return bringToFront(updatedState, action.id);
    }

    case 'SYNC_VIEWPORT': {
      return {
        ...state,
        viewport: action.viewport,
        windows: state.windows.map((item) => {
          const nextRestoreBounds = clampBounds(item.restoreBounds ?? item.bounds, item.minSize, action.viewport);

          return {
            ...item,
            restoreBounds: nextRestoreBounds,
            bounds: item.isMaximized
              ? getMaximizedBounds(action.viewport)
              : clampBounds(item.bounds, item.minSize, action.viewport),
          };
        }),
      };
    }

    case 'COMPLETE_WINDOW_ANIMATION': {
      const targetWindow = state.windows.find((item) => item.id === action.id);

      if (!targetWindow || targetWindow.animationState !== action.animationState) {
        return state;
      }

      if (action.animationState === 'opening') {
        return {
          ...state,
          windows: state.windows.map((item) =>
            item.id === action.id
              ? {
                  ...item,
                  animationState: 'open',
                }
              : item,
          ),
        };
      }

      if (action.animationState === 'minimizing') {
        return {
          ...state,
          windows: state.windows.map((item) =>
            item.id === action.id
              ? {
                  ...item,
                  animationState: 'minimized',
                }
              : item,
          ),
        };
      }

      if (action.animationState === 'closing') {
        const windows = state.windows.map((item) =>
          item.id === action.id
            ? {
                ...item,
                isOpen: false,
                isMinimized: false,
                isMaximized: false,
                animationState: 'closed',
                animationOrigin: 'desktop',
                bounds: clampBounds(item.restoreBounds ?? item.bounds, item.minSize, state.viewport),
              }
            : item,
        );

        return {
          ...state,
          windows,
          activeWindowId: getNextActiveId(windows),
        };
      }

      return state;
    }

    default:
      return state;
  }
}

export function useWindowManager(appDefinitions, viewport) {
  const [state, dispatch] = useReducer(windowReducer, { appDefinitions, viewport }, createInitialState);

  useEffect(() => {
    dispatch({ type: 'SYNC_VIEWPORT', viewport });
  }, [viewport.height, viewport.width]);

  const actions = useMemo(
    () => ({
      openWindow: (id) => dispatch({ type: 'OPEN_WINDOW', id }),
      focusWindow: (id) => dispatch({ type: 'FOCUS_WINDOW', id }),
      closeWindow: (id) => dispatch({ type: 'CLOSE_WINDOW', id }),
      minimizeWindow: (id) => dispatch({ type: 'MINIMIZE_WINDOW', id }),
      completeWindowAnimation: (id, animationState) => dispatch({ type: 'COMPLETE_WINDOW_ANIMATION', id, animationState }),
      toggleMaximizeWindow: (id) => dispatch({ type: 'TOGGLE_MAXIMIZE_WINDOW', id }),
      updateWindowBounds: (id, bounds) => dispatch({ type: 'UPDATE_WINDOW_BOUNDS', id, bounds }),
      restoreFromMaximize: (id, anchorRatio, clientX, clientY) => {
        const targetWindow = state.windows.find((item) => item.id === id);

        if (!targetWindow || !targetWindow.allowMaximize) {
          return null;
        }

        const restoreBounds = clampBounds(targetWindow.restoreBounds ?? targetWindow.bounds, targetWindow.minSize, state.viewport);
        const nextLeft = clientX - restoreBounds.width * anchorRatio;
        const nextTop = clientY - 22;
        const nextBounds = clampBounds(
          {
            ...restoreBounds,
            left: nextLeft,
            top: nextTop,
          },
          targetWindow.minSize,
          state.viewport,
        );

        dispatch({ type: 'RESTORE_FROM_MAXIMIZE', id, left: nextBounds.left, top: nextBounds.top });

        return nextBounds;
      },
      handleTaskbarClick: (windowItem) => {
        if (!windowItem.isOpen) {
          dispatch({ type: 'OPEN_WINDOW', id: windowItem.id });
          return;
        }

        if (windowItem.isMinimized) {
          dispatch({ type: 'OPEN_WINDOW', id: windowItem.id });
          return;
        }

        if (windowItem.windowVariant === 'dialog') {
          dispatch({ type: 'FOCUS_WINDOW', id: windowItem.id });
          return;
        }

        if (state.activeWindowId === windowItem.id) {
          dispatch({ type: 'MINIMIZE_WINDOW', id: windowItem.id });
          return;
        }

        dispatch({ type: 'FOCUS_WINDOW', id: windowItem.id });
      },
    }),
    [state.activeWindowId, state.viewport, state.windows],
  );

  return {
    windows: state.windows,
    activeWindowId: state.activeWindowId,
    ...actions,
  };
}
