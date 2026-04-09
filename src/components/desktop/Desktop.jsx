import { useState } from 'react';
import { DesktopIcon } from './DesktopIcon';
import { useDesktopIconLayout } from '../../hooks/useDesktopIconLayout';

export function Desktop({ apps, onOpenApp, wallpaperUrl }) {
  const [selectedIconId, setSelectedIconId] = useState(null);
  const { draggingIconId, iconScale, positions, shouldSuppressOpen, startDrag } = useDesktopIconLayout(apps);

  return (
    <div
      className="windows-wallpaper relative h-full w-full overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${wallpaperUrl})` }}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          setSelectedIconId(null);
        }
      }}
    >
      <div
        className="absolute inset-0 px-4 pt-4"
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) {
            setSelectedIconId(null);
          }
        }}
      >
        {apps.map((app) => (
          <div
            key={app.id}
            className="absolute will-change-transform"
            style={{
              left: 0,
              top: 0,
              transform: `translate3d(${positions[app.id]?.left ?? 0}px, ${positions[app.id]?.top ?? 0}px, 0)`,
              zIndex: draggingIconId === app.id ? 20 : 1,
            }}
          >
            <DesktopIcon
              app={app}
              iconScale={iconScale}
              isDragging={draggingIconId === app.id}
              isSelected={selectedIconId === app.id}
              onOpen={onOpenApp}
              onPointerDown={startDrag(app.id, setSelectedIconId)}
              onSelect={setSelectedIconId}
              shouldSuppressOpen={shouldSuppressOpen}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
