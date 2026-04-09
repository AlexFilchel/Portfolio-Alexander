import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useViewportSize } from './useViewportSize';

const STORAGE_KEY = 'portfolio-alex-desktop-icons';
const BASE_ICON_WIDTH = 116;
const BASE_ICON_HEIGHT = 126;
const TASKBAR_HEIGHT = 74;
const DRAG_THRESHOLD = 6;
const GRID_TARGET_COLUMNS = 16;
const GRID_TARGET_ROWS = 7;
const GRID_HORIZONTAL_GAP = 24;
const GRID_VERTICAL_GAP = 16;
const GRID_SIDE_PADDING = 18;
const GRID_TOP_PADDING = 20;
const GRID_BOTTOM_PADDING = 16;
const STANDARD_VIEWPORT_WIDTH = 1440;
const STANDARD_VIEWPORT_HEIGHT = 900;
const MIN_ICON_SCALE = 0.72;
const MIN_GRID_ROWS = GRID_TARGET_ROWS - 2;
const MOBILE_BREAKPOINT = 768;
const MOBILE_MIN_ICON_SCALE = 0.84;

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function getResponsiveScale(width, height) {
  const widthScale = width / STANDARD_VIEWPORT_WIDTH;
  const heightScale = height / STANDARD_VIEWPORT_HEIGHT;
  const minScale = width < MOBILE_BREAKPOINT ? MOBILE_MIN_ICON_SCALE : MIN_ICON_SCALE;

  return clamp(Math.min(widthScale, heightScale), minScale, 1);
}

function getIconMetrics(width, height) {
  const scale = getResponsiveScale(width, height);

  return {
    scale,
    iconWidth: Math.round(BASE_ICON_WIDTH * scale),
    iconHeight: Math.round(BASE_ICON_HEIGHT * scale),
    horizontalGap: Math.round(GRID_HORIZONTAL_GAP * scale),
    verticalGap: Math.round(GRID_VERTICAL_GAP * scale),
    sidePadding: Math.round(GRID_SIDE_PADDING * scale),
    topPadding: Math.round(GRID_TOP_PADDING * scale),
    bottomPadding: Math.round(GRID_BOTTOM_PADDING * scale),
  };
}

function getDefaultAssignments(apps) {
  return apps.reduce((accumulator, app) => {
    accumulator[app.id] = {
      column: app.desktopPosition.column,
      row: app.desktopPosition.row,
    };

    return accumulator;
  }, {});
}

function getGridMetrics(width, height) {
  const metrics = getIconMetrics(width, height);
  const maxRows = width < MOBILE_BREAKPOINT ? GRID_TARGET_ROWS - 1 : GRID_TARGET_ROWS;
  const minRows = width < MOBILE_BREAKPOINT ? MIN_GRID_ROWS - 1 : MIN_GRID_ROWS;
  const safeWidth = Math.max(width, metrics.iconWidth + metrics.sidePadding * 2);
  const safeHeight = Math.max(height - TASKBAR_HEIGHT, metrics.iconHeight + metrics.topPadding + metrics.bottomPadding);
  const innerWidth = Math.max(safeWidth - metrics.sidePadding * 2, metrics.iconWidth);
  const innerHeight = Math.max(safeHeight - metrics.topPadding - metrics.bottomPadding, metrics.iconHeight);
  const standardInnerWidth = STANDARD_VIEWPORT_WIDTH - GRID_SIDE_PADDING * 2;
  const standardInnerHeight = STANDARD_VIEWPORT_HEIGHT - TASKBAR_HEIGHT - GRID_TOP_PADDING - GRID_BOTTOM_PADDING;
  const targetCellWidth = Math.max(standardInnerWidth / GRID_TARGET_COLUMNS, metrics.iconWidth + metrics.horizontalGap);
  const targetCellHeight = Math.max(standardInnerHeight / GRID_TARGET_ROWS, metrics.iconHeight + metrics.verticalGap);
  const columns = Math.max(1, Math.round(innerWidth / targetCellWidth));
  const rows = clamp(Math.round(innerHeight / targetCellHeight), minRows, maxRows);

  return {
    columns,
    rows,
    cellWidth: innerWidth / columns,
    cellHeight: innerHeight / rows,
    iconScale: metrics.scale,
    iconWidth: metrics.iconWidth,
    iconHeight: metrics.iconHeight,
    minLeft: metrics.sidePadding,
    maxLeft: safeWidth - metrics.iconWidth - metrics.sidePadding,
    minTop: metrics.topPadding,
    maxTop: safeHeight - metrics.iconHeight - metrics.bottomPadding,
  };
}

function getCellKey(cell) {
  return `${cell.column}:${cell.row}`;
}

function getCellPosition(cell, grid) {
  const centerX = grid.minLeft + cell.column * grid.cellWidth + grid.cellWidth / 2;
  const centerY = grid.minTop + cell.row * grid.cellHeight + grid.cellHeight / 2;

  return {
    left: clamp(centerX - grid.iconWidth / 2, grid.minLeft, grid.maxLeft),
    top: clamp(centerY - grid.iconHeight / 2, grid.minTop, grid.maxTop),
  };
}

function getNearestCell(position, grid) {
  const centerX = position.left + grid.iconWidth / 2;
  const centerY = position.top + grid.iconHeight / 2;

  return {
    column: clamp(Math.round((centerX - grid.minLeft - grid.cellWidth / 2) / grid.cellWidth), 0, grid.columns - 1),
    row: clamp(Math.round((centerY - grid.minTop - grid.cellHeight / 2) / grid.cellHeight), 0, grid.rows - 1),
  };
}

function findNearestAvailableCell(targetCell, occupiedCells, grid) {
  const maxRadius = Math.max(grid.columns, grid.rows);

  for (let radius = 0; radius <= maxRadius; radius += 1) {
    for (let row = Math.max(0, targetCell.row - radius); row <= Math.min(grid.rows - 1, targetCell.row + radius); row += 1) {
      for (let column = Math.max(0, targetCell.column - radius); column <= Math.min(grid.columns - 1, targetCell.column + radius); column += 1) {
        const isOuterRing = Math.abs(column - targetCell.column) === radius || Math.abs(row - targetCell.row) === radius;

        if (!isOuterRing) {
          continue;
        }

        const candidate = { column, row };

        if (!occupiedCells.has(getCellKey(candidate))) {
          return candidate;
        }
      }
    }
  }

  return {
    column: clamp(targetCell.column, 0, grid.columns - 1),
    row: clamp(targetCell.row, 0, grid.rows - 1),
  };
}

function normalizeAssignments(apps, assignments, grid) {
  const occupiedCells = new Set();

  return apps.reduce((accumulator, app) => {
    const requestedCell = assignments[app.id] ?? app.desktopPosition;
    const boundedCell = {
      column: clamp(requestedCell.column, 0, grid.columns - 1),
      row: clamp(requestedCell.row, 0, grid.rows - 1),
    };
    const nextCell = occupiedCells.has(getCellKey(boundedCell))
      ? findNearestAvailableCell(boundedCell, occupiedCells, grid)
      : boundedCell;

    occupiedCells.add(getCellKey(nextCell));
    accumulator[app.id] = nextCell;

    return accumulator;
  }, {});
}

function getPositionsFromAssignments(apps, assignments, grid) {
  return apps.reduce((accumulator, app) => {
    accumulator[app.id] = getCellPosition(assignments[app.id] ?? app.desktopPosition, grid);
    return accumulator;
  }, {});
}

function getInitialGrid() {
  if (typeof window === 'undefined') {
    return getGridMetrics(1440, 900);
  }

  return getGridMetrics(window.innerWidth, window.innerHeight);
}

function getStoredAssignments(apps, grid) {
  const defaults = getDefaultAssignments(apps);

  if (typeof window === 'undefined') {
    return normalizeAssignments(apps, defaults, grid);
  }

  try {
    const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '{}');
    const assignments = apps.reduce((accumulator, app) => {
      const saved = stored[app.id];

      if (saved && Number.isFinite(saved.column) && Number.isFinite(saved.row)) {
        accumulator[app.id] = {
          column: saved.column,
          row: saved.row,
        };
        return accumulator;
      }

      if (saved && Number.isFinite(saved.left) && Number.isFinite(saved.top)) {
        accumulator[app.id] = getNearestCell(saved, grid);
        return accumulator;
      }

      accumulator[app.id] = defaults[app.id];
      return accumulator;
    }, {});

    return normalizeAssignments(apps, assignments, grid);
  } catch {
    return normalizeAssignments(apps, defaults, grid);
  }
}

export function useDesktopIconLayout(apps) {
  const viewport = useViewportSize();
  const grid = useMemo(() => getGridMetrics(viewport.width, viewport.height), [viewport.height, viewport.width]);
  const [assignments, setAssignments] = useState(() => getStoredAssignments(apps, getInitialGrid()));
  const [draggingIconId, setDraggingIconId] = useState(null);
  const [dragPosition, setDragPosition] = useState(null);
  const dragPositionRef = useRef(null);
  const dragRef = useRef({
    frameId: 0,
    lastDraggedAt: 0,
    lastDraggedId: null,
    pendingPosition: null,
  });

  useEffect(() => {
    setAssignments((current) => normalizeAssignments(apps, current, grid));
  }, [apps, grid]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(assignments));
  }, [assignments]);

  useEffect(() => {
    dragPositionRef.current = dragPosition;
  }, [dragPosition]);

  const positions = useMemo(() => {
    const basePositions = getPositionsFromAssignments(apps, assignments, grid);

    if (draggingIconId && dragPosition) {
      basePositions[draggingIconId] = dragPosition;
    }

    return basePositions;
  }, [apps, assignments, dragPosition, draggingIconId, grid]);

  const flushFrame = useCallback(() => {
    dragRef.current.frameId = 0;

    if (!dragRef.current.pendingPosition) {
      return;
    }

    const nextPosition = dragRef.current.pendingPosition;
    dragRef.current.pendingPosition = null;
    dragPositionRef.current = nextPosition;

    setDragPosition((current) => {
      if (current?.left === nextPosition.left && current?.top === nextPosition.top) {
        return current;
      }

      return nextPosition;
    });
  }, []);

  const shouldSuppressOpen = useCallback(
    (appId) => dragRef.current.lastDraggedId === appId && Date.now() - dragRef.current.lastDraggedAt < 240,
    [],
  );

  const startDrag = useCallback(
    (appId, onSelect) => (event) => {
      if (event.button !== 0) {
        return;
      }

      event.stopPropagation();
      onSelect(appId);

      const origin = positions[appId] ?? getCellPosition(assignments[appId] ?? { column: 0, row: 0 }, grid);
      const pointerOffsetX = event.clientX - origin.left;
      const pointerOffsetY = event.clientY - origin.top;
      let moved = false;

      setDraggingIconId(appId);
      dragPositionRef.current = origin;
      setDragPosition(origin);

      const queuePosition = (nextPosition) => {
        dragRef.current.pendingPosition = nextPosition;

        if (dragRef.current.frameId) {
          return;
        }

        dragRef.current.frameId = window.requestAnimationFrame(flushFrame);
      };

      const handlePointerMove = (moveEvent) => {
        const deltaX = moveEvent.clientX - event.clientX;
        const deltaY = moveEvent.clientY - event.clientY;

        if (!moved && Math.hypot(deltaX, deltaY) < DRAG_THRESHOLD) {
          return;
        }

        moved = true;

        queuePosition({
          left: clamp(moveEvent.clientX - pointerOffsetX, grid.minLeft, grid.maxLeft),
          top: clamp(moveEvent.clientY - pointerOffsetY, grid.minTop, grid.maxTop),
        });
      };

      const finishDrag = () => {
        window.removeEventListener('pointermove', handlePointerMove);
        window.removeEventListener('pointerup', finishDrag);
        window.removeEventListener('pointercancel', finishDrag);

        const finalQueuedPosition = dragRef.current.pendingPosition;

        if (dragRef.current.frameId) {
          window.cancelAnimationFrame(dragRef.current.frameId);
          flushFrame();
        }

        const releasedPosition = finalQueuedPosition ?? dragPositionRef.current ?? origin;

        if (moved) {
          const targetCell = getNearestCell(releasedPosition, grid);

          setAssignments((current) => {
            const nextAssignments = { ...current };
            const previousCell = current[appId];
            const occupiedApp = apps.find(
              (app) => app.id !== appId
                && current[app.id]?.column === targetCell.column
                && current[app.id]?.row === targetCell.row,
            );

            nextAssignments[appId] = targetCell;

            if (occupiedApp && previousCell) {
              nextAssignments[occupiedApp.id] = previousCell;
            }

            return normalizeAssignments(apps, nextAssignments, grid);
          });

          dragRef.current.lastDraggedId = appId;
          dragRef.current.lastDraggedAt = Date.now();
        }

        dragRef.current.pendingPosition = null;
        setDragPosition(null);
        setDraggingIconId(null);
      };

      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', finishDrag);
      window.addEventListener('pointercancel', finishDrag);
    },
    [apps, assignments, flushFrame, grid, positions],
  );

  return {
    draggingIconId,
    iconScale: grid.iconScale,
    positions,
    shouldSuppressOpen,
    startDrag,
  };
}
