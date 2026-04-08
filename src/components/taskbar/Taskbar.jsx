import { useEffect, useMemo, useRef, useState } from 'react';
import { AppIcon } from '../common/AppIcon';
import { classNames } from '../../utils/classNames';
import { SearchPanel } from './SearchPanel';
import lupaUrl from '../../../imagenes/lupa.webp';

const staticPinnedItems = [{ id: 'search', title: 'Buscar', iconSrc: lupaUrl, type: 'system' }];

function TaskbarItem({ app, isActive, isOpen, isSearchOpen, layoutSignature, onBoundsChange, onItemClick, onOpenApp, setIsSearchOpen, setSearchQuery, showDivider, windowItem }) {
  const buttonRef = useRef(null);

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
          isActive && 'bg-white/72 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.85)]',
        )}
        aria-label={app.title}
        aria-pressed={app.id === 'search' ? isSearchOpen : isActive}
      >
        <AppIcon
          icon={app.iconSrc ?? app.icon}
          frameClassName="h-[44px] w-[44px] rounded-[14px] border-transparent bg-transparent p-0 shadow-none"
        />
        <span
          className={classNames(
            'absolute bottom-[2px] left-1/2 h-[3px] -translate-x-1/2 rounded-full bg-sky-500 transition-all',
            isOpen ? 'w-4 opacity-100' : 'w-1.5 opacity-0 group-hover:opacity-50',
            isActive && 'w-6 bg-sky-600',
          )}
        />
      </button>

      {showDivider ? <span className="mx-1 h-7 w-px bg-slate-300/65" /> : null}
    </div>
  );
}

export function Taskbar({ apps, isHidden, windows, activeWindowId, pinnedAppIds, onItemClick, onItemBoundsChange, onOpenApp }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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
  const layoutSignature = useMemo(
    () => taskbarItems.map((item) => item.id).join('|'),
    [taskbarItems],
  );

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

      <div className="pointer-events-auto mx-auto mb-2 h-[66px] w-[min(calc(100%-12px),88rem)] rounded-[22px] border border-white/50 bg-[rgba(238,242,251,0.68)] px-3 shadow-[0_18px_44px_rgba(15,23,42,0.2)] backdrop-blur-[28px]">
        <div className="flex h-full items-center justify-center">
          <div className="flex items-center gap-2 rounded-[20px] bg-[rgba(255,255,255,0.32)] px-3 py-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.55)]">
            {taskbarItems.map((app, index) => {
              const windowItem = windowMap.get(app.id);
              const isOpen = Boolean(windowItem?.isOpen);
              const isActive = (activeWindowId === app.id && !windowItem?.isMinimized) || (app.id === 'search' && isSearchOpen);
              const showDivider = index === staticPinnedItems.length - 1;

              return (
                <TaskbarItem
                  key={app.id}
                  app={app}
                  isActive={isActive}
                  isOpen={isOpen}
                  isSearchOpen={isSearchOpen}
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
      </div>
    </footer>
  );
}
