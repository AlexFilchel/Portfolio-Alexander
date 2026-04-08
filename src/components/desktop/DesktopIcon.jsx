import { memo } from 'react';
import { AppIcon } from '../common/AppIcon';
import { classNames } from '../../utils/classNames';

function supportsSingleTapOpen() {
  if (typeof window === 'undefined') {
    return false;
  }

  return window.matchMedia?.('(pointer: coarse)').matches || navigator.maxTouchPoints > 0;
}

function DesktopIconComponent({ app, isDragging, isSelected, onOpen, onPointerDown, onSelect, shouldSuppressOpen }) {
  const opensOnSingleTap = supportsSingleTapOpen();

  return (
    <button
      type="button"
      onMouseDown={(event) => {
        event.stopPropagation();
        onSelect(app.id);
      }}
      onPointerDown={onPointerDown}
      onDoubleClick={() => {
        if (!shouldSuppressOpen(app.id)) {
          onOpen(app.id);
        }
      }}
      onClick={(event) => {
        event.stopPropagation();
        onSelect(app.id);

        if (opensOnSingleTap && !shouldSuppressOpen(app.id)) {
          onOpen(app.id);
        }
      }}
      className={classNames(
        'group flex w-[116px] touch-none flex-col items-center gap-2.5 rounded-[14px] px-3 py-2.5 text-center text-white transition duration-150 focus:outline-none focus:ring-1 focus:ring-white/80',
        isSelected
          ? 'bg-[#d4ebff]/44 outline outline-1 outline-[#eff7ff]/95 backdrop-blur-sm'
          : 'hover:bg-white/14 hover:outline hover:outline-1 hover:outline-white/20',
        isDragging && 'cursor-grabbing bg-[#d4ebff]/40 outline outline-1 outline-[#eff7ff]/85',
      )}
      aria-label={`Abrir ${app.title}`}
    >
      <AppIcon icon={app.iconSrc ?? app.icon} frameClassName="h-[72px] w-[72px] rounded-[22px] border-white/50 bg-white/20 p-[3px] shadow-[0_14px_30px_rgba(0,0,0,0.18)] backdrop-blur-sm" />
      <p className="min-h-[2rem] w-full rounded-[6px] px-1 text-[12px] font-medium leading-[1.3] text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.78)]">
        {app.title}
      </p>
    </button>
  );
}

export const DesktopIcon = memo(DesktopIconComponent);
