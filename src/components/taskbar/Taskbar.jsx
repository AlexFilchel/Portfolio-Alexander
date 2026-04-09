import { useEffect, useMemo, useRef, useState } from 'react';
import { AppIcon } from '../common/AppIcon';
import { classNames } from '../../utils/classNames';
import { useViewportSize } from '../../hooks/useViewportSize';
import { SearchPanel } from './SearchPanel';
import lupaUrl from '../../../imagenes/lupa.webp';

const staticPinnedItems = [{ id: 'search', title: 'Buscar', iconSrc: lupaUrl, type: 'system' }];
const STANDARD_VIEWPORT_WIDTH = 1440;
const STANDARD_VIEWPORT_HEIGHT = 900;
const TASKBAR_BASE_HEIGHT = 74;
const DESKTOP_TASKBAR_SIDE_GAP = 150;
const DESKTOP_TASKBAR_BOTTOM_GAP = 18;
const DESKTOP_TASKBAR_MIN_SIDE_GAP = 28;
const DESKTOP_TASKBAR_SIDE_GAP_FALLBACK_WIDTH = 1040;
const DESKTOP_TASKBAR_ITEM_SIZE = 58;
const DESKTOP_TASKBAR_ICON_SIZE = 52;
const DESKTOP_TASKBAR_MIN_SCALE = 0.72;
const MOBILE_BREAKPOINT = 768;
const MOBILE_TASKBAR_SIDE_GAP = 22;
const MOBILE_TASKBAR_BOTTOM_GAP = 34;
const MOBILE_TASKBAR_MIN_ICON_SIZE = 60;
const MOBILE_TASKBAR_MAX_ICON_SIZE = 72;
const MOBILE_VISIBLE_TASKBAR_IDS = ['search', 'about', 'contact', 'guide'];

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function getDesktopTaskbarSideGap(width) {
  if (width >= STANDARD_VIEWPORT_WIDTH) {
    return DESKTOP_TASKBAR_SIDE_GAP;
  }

  if (width <= DESKTOP_TASKBAR_SIDE_GAP_FALLBACK_WIDTH) {
    return DESKTOP_TASKBAR_MIN_SIDE_GAP;
  }

  const progress = (width - DESKTOP_TASKBAR_SIDE_GAP_FALLBACK_WIDTH) / (STANDARD_VIEWPORT_WIDTH - DESKTOP_TASKBAR_SIDE_GAP_FALLBACK_WIDTH);

  return DESKTOP_TASKBAR_MIN_SIDE_GAP + ((DESKTOP_TASKBAR_SIDE_GAP - DESKTOP_TASKBAR_MIN_SIDE_GAP) * progress);
}

function getDesktopTaskbarScale(width, height) {
  const widthScale = width / STANDARD_VIEWPORT_WIDTH;
  const heightScale = height / STANDARD_VIEWPORT_HEIGHT;

  return clamp(Math.min(widthScale, heightScale), DESKTOP_TASKBAR_MIN_SCALE, 1);
}

function getDesktopTaskbarMetrics(width, height) {
  const scale = getDesktopTaskbarScale(width, height);
  const compression = clamp((1120 - width) / 340, 0, 1);

  return {
    contentGap: (18 - (12 * compression)) * scale,
    groupGap: (8 - (4 * compression)) * scale,
    groupPaddingX: (12 - (4 * compression)) * scale,
    groupPaddingY: (6 - compression) * scale,
    groupRadius: (20 - compression) * scale,
    iconSize: (DESKTOP_TASKBAR_ICON_SIZE - compression) * scale,
    itemSize: (DESKTOP_TASKBAR_ITEM_SIZE - (2 * compression)) * scale,
    scale,
    shellPaddingX: (14 - (6 * compression)) * scale,
    shellRadius: (22 - compression) * scale,
    shellMinHeight: TASKBAR_BASE_HEIGHT * scale,
    trayGap: (12 - (4 * compression)) * scale,
    trayIconSize: (16 - compression) * scale,
    trayPaddingX: (12 - (3 * compression)) * scale,
    trayPaddingY: (8 - compression) * scale,
    trayRadius: (18 - compression) * scale,
    trayTextSize: (14 - compression) * scale,
    trayWidth: (124 - (32 * compression)) * scale,
  };
}

function getMobileTaskbarMetrics(width) {
  const progress = clamp((width - 320) / (MOBILE_BREAKPOINT - 320), 0, 1);
  const iconSize = MOBILE_TASKBAR_MIN_ICON_SIZE + ((MOBILE_TASKBAR_MAX_ICON_SIZE - MOBILE_TASKBAR_MIN_ICON_SIZE) * progress);

  return {
    buttonSize: iconSize + 8,
    containerPaddingX: 12 + (4 * progress),
    containerPaddingY: 8 + (4 * progress),
    iconSize,
    sideGap: 14 + (8 * progress),
  };
}

function SystemTray({ gap = 12, iconSize = 16, paddingX = 12, paddingY = 8, radius = 18, textSize = 14, width = 124 }) {
  const [currentTime, setCurrentTime] = useState(() => new Date());

  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(new Date());
    };

    updateTime();

    const intervalId = window.setInterval(updateTime, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  const formattedTime = useMemo(
    () =>
      currentTime.toLocaleTimeString('es-AR', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    [currentTime],
  );

  return (
    <div
      className="hidden items-center justify-end bg-[rgba(255,255,255,0.32)] text-slate-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.55)] md:flex"
      style={{
        borderRadius: `${radius}px`,
        gap: `${gap}px`,
        minWidth: `${width}px`,
        padding: `${paddingY}px ${paddingX}px`,
      }}
    >
      <span aria-hidden="true" className="flex items-center justify-center text-slate-600" style={{ height: `${iconSize}px`, width: `${iconSize}px` }}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ height: `${iconSize}px`, width: `${iconSize}px` }}>
          <path d="M5 9.5V14.5H8.5L13 18V6L8.5 9.5H5Z" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M16 9C17.2 10.1 17.8 11.2 17.8 12C17.8 12.8 17.2 13.9 16 15" strokeLinecap="round" />
          <path d="M18.5 6.8C20.4 8.5 21.5 10.2 21.5 12C21.5 13.8 20.4 15.5 18.5 17.2" strokeLinecap="round" />
        </svg>
      </span>

      <span aria-hidden="true" className="flex items-center justify-center text-slate-600" style={{ height: `${iconSize}px`, width: `${iconSize}px` }}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ height: `${iconSize}px`, width: `${iconSize}px` }}>
          <path d="M12 18H12.01" strokeLinecap="round" />
          <path d="M8.2 14.2C10.3 12.1 13.7 12.1 15.8 14.2" strokeLinecap="round" />
          <path d="M5.5 11.5C9.1 7.9 14.9 7.9 18.5 11.5" strokeLinecap="round" />
          <path d="M2.8 8.8C7.9 3.7 16.1 3.7 21.2 8.8" strokeLinecap="round" />
        </svg>
      </span>

      <time
        dateTime={currentTime.toISOString()}
        className="min-w-[3.5rem] text-right font-medium tabular-nums text-slate-800"
        style={{ fontSize: `${textSize}px` }}
      >
        {formattedTime}
      </time>
    </div>
  );
}

function TaskbarItem({ app, iconSize = 44, isActive, isMobile = false, isOpen, isSearchOpen, itemSize = 50, layoutSignature, onBoundsChange, onItemClick, onOpenApp, setIsSearchOpen, setSearchQuery, showDivider, windowItem }) {
  const buttonRef = useRef(null);
  const buttonStyle = {
    borderRadius: `${Math.max(16, itemSize * 0.32)}px`,
    height: `${itemSize}px`,
    width: `${itemSize}px`,
  };
  const iconFrameStyle = {
    borderRadius: `${Math.max(14, iconSize * 0.32)}px`,
    height: `${iconSize}px`,
    width: `${iconSize}px`,
  };
  const indicatorStyle = {
    height: `${Math.max(3, itemSize * 0.06)}px`,
  };

  useEffect(() => {
    const button = buttonRef.current;

    if (!button) {
      return undefined;
    }

    const measure = () => {
      const rect = button.getBoundingClientRect();

      onBoundsChange(app.id, {
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height,
      });
    };

    measure();
    window.addEventListener('resize', measure);

    return () => {
      window.removeEventListener('resize', measure);
      onBoundsChange(app.id, null);
    };
  }, [app.id, layoutSignature, onBoundsChange]);

  return (
    <div className="flex items-center">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => {
          if (app.id === 'search') {
            setIsSearchOpen((current) => {
              if (!current) {
                setSearchQuery('');
              }

              return !current;
            });
            return;
          }

          if (windowItem) {
            onItemClick(windowItem);
            return;
          }

          if (app.id !== 'search') {
            onOpenApp(app.id);
          }
        }}
        className={classNames(
          'group relative flex h-[50px] w-[50px] items-center justify-center rounded-[16px] transition duration-150 hover:bg-white/55',
          isMobile && 'flex-shrink-0',
          isActive && 'bg-white/72 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.85)]',
        )}
        style={buttonStyle}
        aria-label={app.title}
        aria-pressed={app.id === 'search' ? isSearchOpen : isActive}
      >
        <AppIcon
          icon={app.iconSrc ?? app.icon}
          frameClassName="h-[44px] w-[44px] rounded-[14px] border-transparent bg-transparent p-0 shadow-none"
          frameStyle={iconFrameStyle}
        />
        <span
          className={classNames(
            'absolute bottom-[2px] left-1/2 h-[3px] -translate-x-1/2 rounded-full bg-sky-500 transition-all',
            isOpen ? 'w-4 opacity-100' : 'w-1.5 opacity-0 group-hover:opacity-50',
            isActive && 'w-6 bg-sky-600',
          )}
          style={indicatorStyle}
        />
      </button>

      {showDivider && !isMobile ? <span className="mx-1 h-7 w-px bg-slate-300/65" /> : null}
    </div>
  );
}

export function Taskbar({ apps, isHidden, windows, activeWindowId, pinnedAppIds, onItemClick, onItemBoundsChange, onOpenApp }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const viewport = useViewportSize();

  const windowMap = useMemo(
    () => new Map(windows.map((windowItem) => [windowItem.id, windowItem])),
    [windows],
  );

  const appMap = useMemo(
    () => new Map(apps.map((app) => [app.id, app])),
    [apps],
  );

  const pinnedAppIdSet = useMemo(
    () => new Set(pinnedAppIds),
    [pinnedAppIds],
  );

  const portfolioPinnedApps = useMemo(
    () =>
      pinnedAppIds
        .map((id) => appMap.get(id))
        .filter(Boolean),
    [appMap, pinnedAppIds],
  );

  const extraOpenedApps = useMemo(
    () =>
      windows
        .filter((windowItem) => windowItem.isOpen && !pinnedAppIdSet.has(windowItem.id))
        .sort((a, b) => a.zIndex - b.zIndex)
        .map((windowItem) => appMap.get(windowItem.id))
        .filter(Boolean),
    [appMap, pinnedAppIdSet, windows],
  );

  const taskbarItems = useMemo(
    () => [...staticPinnedItems, ...portfolioPinnedApps, ...extraOpenedApps],
    [extraOpenedApps, portfolioPinnedApps],
  );
  const mobileTaskbarItems = useMemo(
    () => taskbarItems.filter((item) => MOBILE_VISIBLE_TASKBAR_IDS.includes(item.id)),
    [taskbarItems],
  );
  const layoutSignature = useMemo(
    () => taskbarItems.map((item) => item.id).join('|'),
    [taskbarItems],
  );
  const isMobile = viewport.width < MOBILE_BREAKPOINT;
  const mobileTaskbarMetrics = useMemo(
    () => getMobileTaskbarMetrics(viewport.width),
    [viewport.width],
  );
  const desktopTaskbarSideGap = useMemo(
    () => getDesktopTaskbarSideGap(viewport.width),
    [viewport.width],
  );
  const desktopAvailableWidth = Math.max(viewport.width - (desktopTaskbarSideGap * 2), 0);
  const desktopTaskbarMetrics = useMemo(
    () => getDesktopTaskbarMetrics(viewport.width, viewport.height),
    [viewport.height, viewport.width],
  );
  const taskbarSideGap = isMobile ? mobileTaskbarMetrics.sideGap : desktopTaskbarSideGap;
  const taskbarWidth = useMemo(
    () => (isMobile
      ? Math.max(viewport.width - taskbarSideGap * 2, 0)
      : desktopAvailableWidth),
    [desktopAvailableWidth, isMobile, taskbarSideGap, viewport.width],
  );
  const taskbarHeight = useMemo(
    () => (isMobile ? mobileTaskbarMetrics.buttonSize + (mobileTaskbarMetrics.containerPaddingY * 2) : desktopTaskbarMetrics.shellMinHeight),
    [desktopTaskbarMetrics.shellMinHeight, isMobile, mobileTaskbarMetrics.buttonSize, mobileTaskbarMetrics.containerPaddingY],
  );
  const taskbarBottomGap = isMobile ? MOBILE_TASKBAR_BOTTOM_GAP : DESKTOP_TASKBAR_BOTTOM_GAP;

  if (isHidden) {
    return null;
  }

  return (
    <footer className="pointer-events-none absolute inset-x-0 bottom-0 z-[200]">
      <SearchPanel
        apps={apps}
        query={searchQuery}
        isOpen={isSearchOpen}
        onQueryChange={setSearchQuery}
        onClose={() => {
          setIsSearchOpen(false);
          setSearchQuery('');
        }}
        onOpenApp={onOpenApp}
      />

      {isMobile ? (
        <div
          className="pointer-events-auto mx-auto"
          style={{
            marginBottom: `${taskbarBottomGap}px`,
            width: `${Math.max(viewport.width - mobileTaskbarMetrics.sideGap * 2, 0)}px`,
          }}
        >
          <div
            className="flex items-center justify-between rounded-[24px] border border-white/50 bg-[rgba(255,255,255,0.34)] shadow-[0_18px_44px_rgba(15,23,42,0.2)] backdrop-blur-[28px]"
            style={{
              minHeight: `${mobileTaskbarMetrics.buttonSize + (mobileTaskbarMetrics.containerPaddingY * 2)}px`,
              padding: `${mobileTaskbarMetrics.containerPaddingY}px ${mobileTaskbarMetrics.containerPaddingX}px`,
            }}
          >
            {mobileTaskbarItems.map((app, index) => {
              const windowItem = windowMap.get(app.id);
              const isOpen = Boolean(windowItem?.isOpen);
              const isActive = (activeWindowId === app.id && !windowItem?.isMinimized) || (app.id === 'search' && isSearchOpen);
              const showDivider = index === 0;

              return (
                <TaskbarItem
                  key={app.id}
                  app={app}
                  iconSize={mobileTaskbarMetrics.iconSize}
                  isActive={isActive}
                  isMobile
                  isOpen={isOpen}
                  isSearchOpen={isSearchOpen}
                  itemSize={mobileTaskbarMetrics.buttonSize}
                  layoutSignature={layoutSignature}
                  onBoundsChange={onItemBoundsChange}
                  onItemClick={onItemClick}
                  onOpenApp={onOpenApp}
                  setIsSearchOpen={setIsSearchOpen}
                  setSearchQuery={setSearchQuery}
                  showDivider={showDivider}
                  windowItem={windowItem}
                />
              );
            })}
          </div>
        </div>
      ) : (
        <div
          className="pointer-events-auto mx-auto"
          style={{
            height: `${taskbarHeight}px`,
            marginBottom: `${taskbarBottomGap}px`,
            width: `${taskbarWidth}px`,
          }}
        >
          <div
            className="grid h-full w-full items-center rounded-[22px] border border-white/50 bg-[rgba(238,242,251,0.68)] shadow-[0_18px_44px_rgba(15,23,42,0.2)] backdrop-blur-[28px]"
            style={{
              borderRadius: `${desktopTaskbarMetrics.shellRadius}px`,
              columnGap: `${desktopTaskbarMetrics.contentGap}px`,
              gridTemplateColumns: `minmax(0, 1fr) auto minmax(${desktopTaskbarMetrics.trayWidth}px, 1fr)`,
              minHeight: `${desktopTaskbarMetrics.shellMinHeight}px`,
              padding: `0 ${desktopTaskbarMetrics.shellPaddingX}px`,
            }}
          >
            <div aria-hidden="true" />

            <div
              className="justify-self-center"
            >
              <div
                className="flex items-center bg-[rgba(255,255,255,0.32)] shadow-[inset_0_1px_0_rgba(255,255,255,0.55)]"
                style={{
                  borderRadius: `${desktopTaskbarMetrics.groupRadius}px`,
                  gap: `${desktopTaskbarMetrics.groupGap}px`,
                  padding: `${desktopTaskbarMetrics.groupPaddingY}px ${desktopTaskbarMetrics.groupPaddingX}px`,
                }}
              >
                  {taskbarItems.map((app, index) => {
                    const windowItem = windowMap.get(app.id);
                    const isOpen = Boolean(windowItem?.isOpen);
                    const isActive = (activeWindowId === app.id && !windowItem?.isMinimized) || (app.id === 'search' && isSearchOpen);
                    const showDivider = index === staticPinnedItems.length - 1;

                    return (
                      <TaskbarItem
                        key={app.id}
                        app={app}
                        iconSize={desktopTaskbarMetrics.iconSize}
                        isActive={isActive}
                        isOpen={isOpen}
                        isSearchOpen={isSearchOpen}
                        itemSize={desktopTaskbarMetrics.itemSize}
                        layoutSignature={layoutSignature}
                        onBoundsChange={onItemBoundsChange}
                        onItemClick={onItemClick}
                        onOpenApp={onOpenApp}
                        setIsSearchOpen={setIsSearchOpen}
                        setSearchQuery={setSearchQuery}
                        showDivider={showDivider}
                        windowItem={windowItem}
                      />
                    );
                  })}
              </div>
            </div>

            <div className="justify-self-end">
              <SystemTray
                gap={desktopTaskbarMetrics.trayGap}
                iconSize={desktopTaskbarMetrics.trayIconSize}
                paddingX={desktopTaskbarMetrics.trayPaddingX}
                paddingY={desktopTaskbarMetrics.trayPaddingY}
                radius={desktopTaskbarMetrics.trayRadius}
                textSize={desktopTaskbarMetrics.trayTextSize}
                width={desktopTaskbarMetrics.trayWidth}
              />
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}
