import { SectionCard } from '../../components/common/SectionCard';

export function ProjectsListView({ projects, onSelectProject }) {
  return (
    <div className="grid gap-5 animate-window-in">
      {projects.map((project) => (
        <SectionCard key={project.slug} className="overflow-hidden border-emerald-100/80 bg-white/95">
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1.2fr),minmax(280px,0.8fr)] lg:items-start">
            <div>
              <div className="overflow-hidden rounded-[24px] border border-emerald-100 bg-slate-950/5 shadow-[0_16px_36px_rgba(15,23,42,0.12)]">
                <img
                  src={project.media.src}
                  alt={project.media.alt}
                  className="h-64 w-full object-cover object-top sm:h-72 lg:h-[22rem]"
                />
              </div>

              <button
                type="button"
                onClick={() => onSelectProject(project.slug)}
                className="mt-4 inline-flex w-fit items-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Detalles
              </button>
            </div>

            <div className="flex h-full flex-col justify-between gap-5">
              <div className="space-y-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-700/80">
                      Proyecto destacado
                    </p>
                    <h3 className="mt-2 text-2xl font-semibold text-slate-900">{project.name}</h3>
                  </div>

                  <span className="rounded-xl bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    {project.status}
                  </span>
                </div>

                <p className="text-sm leading-6 text-slate-600 md:text-base">{project.shortDescription}</p>
              </div>

            </div>
          </div>
        </SectionCard>
      ))}
    </div>
  );
}
