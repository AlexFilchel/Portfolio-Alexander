import { classNames } from '../../utils/classNames';

const iconBaseClass = 'h-7 w-7';

function IconCanvas({ className = '', children }) {
  return (
    <span className={classNames('relative flex h-full w-full items-center justify-center overflow-hidden rounded-[inherit]', className)}>
      {children}
    </span>
  );
}

function UserIcon() {
  return (
    <IconCanvas className="bg-[radial-gradient(circle_at_28%_22%,rgba(255,255,255,0.55),transparent_38%),linear-gradient(145deg,#50b6ff_0%,#2879ff_48%,#1e4fd8_100%)] text-white shadow-inner shadow-white/20">
      <span className="absolute inset-x-0 bottom-0 h-2/5 bg-white/15" />
      <svg viewBox="0 0 24 24" fill="none" className={iconBaseClass}>
        <circle cx="12" cy="8" r="3.5" fill="currentColor" className="text-white" />
        <path d="M5 19c1.8-2.8 4.2-4.2 7-4.2S17.2 16.2 19 19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="text-white" />
      </svg>
    </IconCanvas>
  );
}

function CvIcon() {
  return (
    <IconCanvas className="bg-[radial-gradient(circle_at_30%_18%,rgba(255,255,255,0.92),rgba(255,255,255,0.68)_42%,rgba(219,234,254,0.96)_100%)] text-sky-700">
      <span className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-sky-400 via-blue-500 to-cyan-400" />
      <svg viewBox="0 0 24 24" fill="none" className={iconBaseClass}>
        <path d="M8 3.8h7l3.2 3.3V19A1.6 1.6 0 0 1 16.6 20.6H8A1.6 1.6 0 0 1 6.4 19V5.4A1.6 1.6 0 0 1 8 3.8Z" fill="currentColor" className="text-white" />
        <path d="M15 3.8v3.3a1 1 0 0 0 1 1h3.2" fill="currentColor" className="text-sky-200" />
        <path d="M9.5 11h5M9.5 14h5M9.5 17h3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="text-sky-700" />
      </svg>
    </IconCanvas>
  );
}

function GuideIcon() {
  return (
    <IconCanvas className="bg-[radial-gradient(circle_at_28%_22%,rgba(255,255,255,0.38),transparent_40%),linear-gradient(150deg,#6b7cff_0%,#7c4dff_45%,#d946ef_100%)] text-white shadow-inner shadow-white/15">
      <svg viewBox="0 0 24 24" fill="none" className={iconBaseClass}>
        <rect x="5" y="4.5" width="14" height="15" rx="2.5" fill="currentColor" className="text-white/95" />
        <path d="M9 9.2h6M9 12.3h6M9 15.4h3.7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" className="text-violet-600" />
        <circle cx="16.8" cy="15.4" r="1.2" fill="currentColor" className="text-fuchsia-500" />
      </svg>
    </IconCanvas>
  );
}

function ProjectsIcon() {
  return (
    <IconCanvas className="bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.45),transparent_38%),linear-gradient(145deg,#ffd86b_0%,#ffbf32_48%,#f59e0b_100%)] text-amber-800 shadow-inner shadow-white/20">
      <svg viewBox="0 0 24 24" fill="none" className={iconBaseClass}>
        <path d="M4.5 8.7A1.7 1.7 0 0 1 6.2 7h3l1.6 1.4H18a1.7 1.7 0 0 1 1.7 1.7v6.6A1.7 1.7 0 0 1 18 18.4H6a1.7 1.7 0 0 1-1.7-1.7Z" fill="currentColor" className="text-amber-500" />
        <path d="M4.8 9.4h14.4v2.2H4.8Z" fill="currentColor" className="text-yellow-100" />
      </svg>
    </IconCanvas>
  );
}

function StartIcon() {
  return (
    <IconCanvas className="bg-transparent text-[#1976ff]">
      <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7">
        <path d="M4 5.2 10.6 4v7H4Z" fill="currentColor" />
        <path d="M12 3.8 20 2.6v8.4h-8Z" fill="currentColor" />
        <path d="M4 12.1h6.6v7L4 18.1Z" fill="currentColor" />
        <path d="M12 12.1h8v8.5l-8-1.2Z" fill="currentColor" />
      </svg>
    </IconCanvas>
  );
}

function SearchIcon() {
  return (
    <IconCanvas className="bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.42),transparent_38%),linear-gradient(145deg,#51c3ff_0%,#1ba4ff_42%,#0d7dff_100%)] text-white">
      <svg viewBox="0 0 24 24" fill="none" className={iconBaseClass}>
        <circle cx="10.5" cy="10.5" r="4.5" stroke="currentColor" strokeWidth="2" />
        <path d="m14 14 4.5 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </IconCanvas>
  );
}

function ExplorerIcon() {
  return (
    <IconCanvas className="bg-[radial-gradient(circle_at_28%_22%,rgba(255,255,255,0.45),transparent_38%),linear-gradient(145deg,#ffe08f_0%,#ffd34d_42%,#ffb300_100%)] text-amber-800">
      <svg viewBox="0 0 24 24" fill="none" className={iconBaseClass}>
        <path d="M4 8.7A1.7 1.7 0 0 1 5.7 7h3.2l1.7 1.5H18a1.7 1.7 0 0 1 1.7 1.7v5.9A1.7 1.7 0 0 1 18 17.8H5.7A1.7 1.7 0 0 1 4 16.1Z" fill="currentColor" className="text-amber-400" />
        <path d="M4 10.4h15.7v2H4Z" fill="currentColor" className="text-yellow-50" />
      </svg>
    </IconCanvas>
  );
}

function BrowserIcon() {
  return (
    <IconCanvas className="bg-[radial-gradient(circle_at_32%_22%,rgba(255,255,255,0.42),transparent_36%),conic-gradient(from_210deg_at_50%_50%,#00d1ff,#0f87ff,#31d6c6,#00d1ff)] text-white">
      <svg viewBox="0 0 24 24" fill="none" className={iconBaseClass}>
        <path d="M18.5 8.5a6.7 6.7 0 1 1-11 7.4c.7.3 1.4.4 2.2.4 3.5 0 6.3-2.7 6.3-6.1 0-.6-.1-1.2-.3-1.7Z" fill="currentColor" className="text-white/90" />
        <path d="M5.6 8.8A6.7 6.7 0 0 1 18.5 8.5c-.7-.3-1.4-.4-2.2-.4-3.5 0-6.3 2.7-6.3 6.1 0 .6.1 1.1.3 1.7A6.7 6.7 0 0 1 5.6 8.8Z" fill="currentColor" className="text-emerald-200" />
      </svg>
    </IconCanvas>
  );
}

function StoreIcon() {
  return (
    <IconCanvas className="bg-[radial-gradient(circle_at_30%_18%,rgba(255,255,255,0.9),rgba(241,245,249,0.86)_44%,rgba(226,232,240,0.98)_100%)] text-sky-600">
      <svg viewBox="0 0 24 24" fill="none" className={iconBaseClass}>
        <path d="M7 8.5V7.7A5 5 0 0 1 12 2.8a5 5 0 0 1 5 4.9v.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M5.5 8.2h13l-.9 9.6a1.8 1.8 0 0 1-1.8 1.6H8.2a1.8 1.8 0 0 1-1.8-1.6Z" fill="currentColor" className="text-sky-500" />
        <path d="M9.3 12h5.4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="text-white" />
      </svg>
    </IconCanvas>
  );
}

const iconMap = {
  user: UserIcon,
  cv: CvIcon,
  guide: GuideIcon,
  projects: ProjectsIcon,
  start: StartIcon,
  search: SearchIcon,
  explorer: ExplorerIcon,
  browser: BrowserIcon,
  store: StoreIcon,
};

export function AppIcon({ icon, className, frameClassName = '', frameStyle }) {
  const IconComponent = iconMap[icon] ?? CvIcon;
  const isImageIcon = typeof icon === 'string' && (/^(https?:|data:|blob:)/.test(icon) || icon.startsWith('/'));

  return (
    <div
      className={classNames(
        'flex h-12 w-12 items-center justify-center rounded-[18px] border border-white/65 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(246,249,255,0.74))] p-[3px] text-slate-700 shadow-[0_14px_30px_rgba(21,101,192,0.18)]',
        frameClassName,
      )}
      style={frameStyle}
    >
      <span className={classNames('block h-full w-full rounded-[14px] text-slate-700', className)}>
        {isImageIcon ? (
          <span className="flex h-full w-full items-center justify-center overflow-hidden rounded-[inherit] bg-transparent p-[2px]">
            <img src={icon} alt="" loading="lazy" decoding="async" className="h-full w-full object-contain" draggable="false" />
          </span>
        ) : (
          <IconComponent />
        )}
      </span>
    </div>
  );
}
