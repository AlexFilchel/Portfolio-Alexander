import { useCallback, useEffect, useState } from 'react';
import { appDefinitions, pinnedAppIds } from './data/apps';
import { AboutApp } from './modules/apps/AboutApp';
import { ContactApp } from './modules/apps/ContactApp';
import { CvApp } from './modules/apps/CvApp';
import { GuideApp } from './modules/apps/GuideApp';
import { ProjectsApp } from './modules/apps/ProjectsApp';
import { Desktop } from './components/desktop/Desktop';
import { Taskbar } from './components/taskbar/Taskbar';
import { WindowFrame } from './components/windows/WindowFrame';
import { useWindowManager } from './hooks/useWindowManager';
import { useViewportSize } from './hooks/useViewportSize';
import wallpaperUrl from '../imagenes/fondo.webp';
import mobileWallpaperUrl from '../imagenes/fondoCelular.webp';

const appComponentMap = {
  about: AboutApp,
  contact: ContactApp,
  cv: CvApp,
  guide: GuideApp,
  projects: ProjectsApp,
};

function App() {
  const viewport = useViewportSize();
  const currentWallpaperUrl = viewport.width <= 768 ? mobileWallpaperUrl : wallpaperUrl;
  const {
    windows,
    activeWindowId,
    openWindow,
    focusWindow,
    closeWindow,
    completeWindowAnimation,
    minimizeWindow,
    toggleMaximizeWindow,
    updateWindowBounds,
    restoreFromMaximize,
    handleTaskbarClick,
  } = useWindowManager(appDefinitions, viewport);
  const [taskbarItemRects, setTaskbarItemRects] = useState({});
  const isTaskbarHidden = windows.some(
    (windowItem) => windowItem.windowVariant === 'standard' && windowItem.isOpen && !windowItem.isMinimized && windowItem.isMaximized,
  );

  const handleTaskbarItemBoundsChange = useCallback((id, rect) => {
    setTaskbarItemRects((current) => {
      if (!rect) {
        if (!(id in current)) {
          return current;
        }

        const nextRects = { ...current };
        delete nextRects[id];
        return nextRects;
      }

      const previousRect = current[id];

      if (
        previousRect
        && previousRect.left === rect.left
        && previousRect.top === rect.top
        && previousRect.width === rect.width
        && previousRect.height === rect.height
      ) {
        return current;
      }

      return {
        ...current,
        [id]: rect,
      };
    });
  }, []);

  useEffect(() => {
    function handleCloseWindow(event) {
      if (event.detail?.id) {
        closeWindow(event.detail.id);
      }
    }

    window.addEventListener('portfolio:close-window', handleCloseWindow);
    return () => window.removeEventListener('portfolio:close-window', handleCloseWindow);
  }, [closeWindow]);

  return (
    <div className="relative h-screen overflow-hidden text-[13px] text-slate-800 selection:bg-sky-500/30">
      <Desktop apps={appDefinitions} onOpenApp={openWindow} wallpaperUrl={currentWallpaperUrl} />

      <main className="pointer-events-none absolute inset-0">
        {windows.map((windowItem) => {
          const ContentComponent = appComponentMap[windowItem.id];

          return (
            <WindowFrame
              key={windowItem.id}
              windowItem={windowItem}
              isActive={activeWindowId === windowItem.id}
              onFocus={focusWindow}
              onClose={closeWindow}
              onAnimationComplete={completeWindowAnimation}
              onMinimize={minimizeWindow}
              onToggleMaximize={toggleMaximizeWindow}
              onUpdateBounds={updateWindowBounds}
              onRestoreFromMaximize={restoreFromMaximize}
              taskbarTargetRect={taskbarItemRects[windowItem.id] ?? null}
              viewport={viewport}
            >
              <ContentComponent />
            </WindowFrame>
          );
        })}
      </main>

      <Taskbar
        apps={appDefinitions}
        isHidden={isTaskbarHidden}
        windows={windows}
        activeWindowId={activeWindowId}
        pinnedAppIds={pinnedAppIds}
        onItemClick={handleTaskbarClick}
        onItemBoundsChange={handleTaskbarItemBoundsChange}
        onOpenApp={openWindow}
      />
    </div>
  );
}

export default App;
