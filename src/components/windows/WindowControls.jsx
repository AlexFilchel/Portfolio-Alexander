function ControlButton({ children, label, className = '', onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-window-control="true"
      className={`flex h-[46px] w-[48px] items-center justify-center rounded-none text-slate-600 transition-colors duration-75 hover:bg-slate-200/78 ${className}`}
      aria-label={label}
    >
      {children}
    </button>
  );
}

export function WindowControls({ allowMaximize = true, allowMinimize = true, isMaximized, onMinimize, onToggleMaximize, onClose }) {
  return (
    <div className="flex items-stretch overflow-hidden rounded-tr-[18px]">
      {allowMinimize ? (
        <ControlButton label="Minimizar" onClick={onMinimize}>
          <span className="block h-0.5 w-4 rounded-full bg-current" />
        </ControlButton>
      ) : null}
      {allowMaximize ? (
        <ControlButton label={isMaximized ? 'Restaurar' : 'Maximizar'} onClick={onToggleMaximize}>
          {isMaximized ? (
            <span className="relative block h-3.5 w-3.5">
              <span className="absolute right-0 top-0 block h-3 w-3 rounded-[3px] border-[1.7px] border-current bg-transparent" />
              <span className="absolute bottom-0 left-0 block h-3 w-3 rounded-[3px] border-[1.7px] border-current bg-transparent" />
            </span>
          ) : (
            <span className="block h-3.5 w-3.5 rounded-[3px] border-[1.7px] border-current bg-transparent" />
          )}
        </ControlButton>
      ) : null}
      <ControlButton label="Cerrar" className="hover:bg-rose-500 hover:text-white" onClick={onClose}>
        <span className="relative block h-4 w-4">
          <span className="absolute left-1/2 top-0 h-4 w-0.5 -translate-x-1/2 rotate-45 rounded-full bg-current" />
          <span className="absolute left-1/2 top-0 h-4 w-0.5 -translate-x-1/2 -rotate-45 rounded-full bg-current" />
        </span>
      </ControlButton>
    </div>
  );
}
