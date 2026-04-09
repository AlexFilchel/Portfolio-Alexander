import { useEffect, useMemo, useRef, useState } from 'react';
import { AppIcon } from '../common/AppIcon';
import { classNames } from '../../utils/classNames';
import lupaUrl from '../../../imagenes/lupa.webp';

export function SearchPanel({ apps, bottomOffset = 74, query, isOpen, onQueryChange, onClose, onOpenApp }) {
  const inputRef = useRef(null);
  const panelRef = useRef(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    inputRef.current?.focus();

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      setSelectedIndex(0);
    }
  }, [isOpen, query]);

  const filteredApps = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return apps
      .map((app) => {
        const haystack = `${app.title} ${app.description} ${(app.keywords ?? []).join(' ')}`.toLowerCase();

        if (!normalizedQuery) {
          return { app, score: 1 };
        }

        let score = 0;

        if (app.title.toLowerCase().startsWith(normalizedQuery)) {
          score += 5;
        }

        if (haystack.includes(normalizedQuery)) {
          score += 3;
        }

        if ((app.keywords ?? []).some((keyword) => keyword.toLowerCase().includes(normalizedQuery))) {
          score += 2;
        }

        return { app, score };
      })
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score || a.app.title.localeCompare(b.app.title, 'es'))
      .map(({ app }) => app);
  }, [apps, query]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="pointer-events-auto fixed inset-0 z-[205]"
      onMouseDown={(event) => {
        if (panelRef.current && !panelRef.current.contains(event.target)) {
          onClose();
        }
      }}
    >
      <section
        ref={panelRef}
        className="absolute left-1/2 z-[210] flex max-h-[min(70vh,42rem)] w-[min(38rem,calc(100vw-1.5rem))] -translate-x-1/2 flex-col overflow-hidden rounded-[26px] border border-white/50 bg-[rgba(240,244,252,0.82)] shadow-[0_32px_80px_rgba(15,23,42,0.35)] backdrop-blur-[30px]"
        style={{
          bottom: `calc(${bottomOffset}px + env(safe-area-inset-bottom, 0px))`,
        }}
        onMouseDown={() => {
          window.requestAnimationFrame(() => inputRef.current?.focus());
        }}
      >
        <div className="border-b border-white/50 p-4">
          <div className="flex items-center gap-3 rounded-[18px] border border-sky-50/90 bg-sky-50/75 px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
            <AppIcon icon={lupaUrl} frameClassName="h-10 w-10 rounded-[13px] border-white/70 bg-white/80 p-[2px] shadow-none" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'ArrowDown') {
                  event.preventDefault();
                  setSelectedIndex((current) => Math.min(current + 1, Math.max(filteredApps.length - 1, 0)));
                  return;
                }

                if (event.key === 'ArrowUp') {
                  event.preventDefault();
                  setSelectedIndex((current) => Math.max(current - 1, 0));
                  return;
                }

                if (event.key === 'Enter' && filteredApps[selectedIndex]) {
                  onOpenApp(filteredApps[selectedIndex].id);
                  onClose();
                }
              }}
              placeholder="Buscar apps, proyectos o Descargar CV"
              className="w-full border-0 bg-transparent text-[15px] font-medium text-slate-800 outline-none placeholder:text-slate-400"
            />
          </div>
        </div>

        <div className="scrollbar-subtle overflow-auto p-3">
          <div className="flex items-center justify-between px-2 pb-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Mejor coincidencia</p>
            <p className="text-[11px] text-slate-400">Enter abre · ↑↓ navega</p>
          </div>

          <div className="space-y-1.5">
            {filteredApps.length ? (
              filteredApps.map((app, index) => (
                <button
                  key={app.id}
                  type="button"
                  onClick={() => {
                    onOpenApp(app.id);
                    onClose();
                  }}
                  className={classNames(
                    'flex w-full items-center gap-3 rounded-[18px] px-3 py-3 text-left transition hover:bg-white/58 focus:outline-none',
                    index === selectedIndex && 'bg-white/58 ring-1 ring-white/70',
                  )}
                >
                  <AppIcon icon={app.iconSrc ?? app.icon} frameClassName="h-[54px] w-[54px] rounded-[17px] border-white/75 bg-white/88 p-[2px] shadow-none" />
                  <div className="min-w-0">
                    <p className="truncate text-[14px] font-semibold text-slate-800">{app.title}</p>
                    <p className="truncate text-[12px] text-slate-500">{app.description}</p>
                    <p className="mt-1 text-[11px] text-slate-400">Abrir aplicación</p>
                  </div>
                </button>
              ))
            ) : (
              <div className="rounded-[18px] bg-white/50 px-4 py-6 text-center text-[13px] text-slate-500">
                  No encontré resultados. Probá con “Descargar CV”, “proyectos” o “sobre mí”.
                </div>
              )}
          </div>
        </div>
      </section>
    </div>
  );
}
