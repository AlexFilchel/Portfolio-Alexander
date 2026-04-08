import { classNames } from '../../utils/classNames';

export function SectionCard({ title, eyebrow, children, className = '' }) {
  return (
    <section
      className={classNames(
        'rounded-2xl border border-[#e5e9f1] bg-white p-5 shadow-[0_8px_20px_rgba(148,163,184,0.12)]',
        className,
      )}
    >
      {(eyebrow || title) && (
        <header className="mb-4">
          {eyebrow ? (
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-600">
              {eyebrow}
            </p>
          ) : null}
          {title ? <h3 className="text-lg font-semibold text-slate-900">{title}</h3> : null}
        </header>
      )}

      {children}
    </section>
  );
}
