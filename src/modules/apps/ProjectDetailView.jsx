import { SectionCard } from '../../components/common/SectionCard';

function BackArrowIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="h-4 w-4">
      <path
        d="M11.75 4.75L6.5 10L11.75 15.25"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TechnologyGroup({ title, items }) {
  return (
    <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4">
      <h4 className="text-sm font-semibold text-slate-800">{title}</h4>
      <ul className="mt-3 space-y-2 text-sm text-slate-600">
        {items.map((item) => (
          <li key={`${title}-${item}`} className="flex gap-3">
            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-emerald-600" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function BulletList({ items }) {
  return (
    <ul className="grid gap-3 text-sm text-slate-600 md:grid-cols-2">
      {items.map((item) => (
        <li key={item} className="flex gap-3 rounded-2xl border border-slate-200 bg-white/80 p-4">
          <span className="mt-2 h-1.5 w-1.5 rounded-full bg-emerald-600" />
          <span className="leading-6">{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function ProjectDetailView({ project, onBack }) {
  return (
    <div className="space-y-5 animate-window-in">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white/90 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
      >
        <BackArrowIcon />
        Volver
      </button>

      <SectionCard className="overflow-hidden border-emerald-100 bg-white/95">
        <div className="overflow-hidden rounded-[28px] border border-emerald-100 bg-slate-950/5 shadow-[0_16px_36px_rgba(15,23,42,0.12)]">
          <img
            src={project.media.src}
            alt={project.media.alt}
            className="h-72 w-full object-cover object-top sm:h-80 lg:h-[30rem]"
          />
        </div>
      </SectionCard>

      <SectionCard title="Descripción del proyecto" eyebrow="Overview">
        <p className="text-sm leading-7 text-slate-600 md:text-base">{project.description}</p>
      </SectionCard>

      <SectionCard title="Tecnologías utilizadas" eyebrow="Stack">
        <div className="grid gap-4 xl:grid-cols-2">
          <TechnologyGroup title="Frontend" items={project.technologies.frontend} />
          <TechnologyGroup title="Backend" items={project.technologies.backend} />
          <TechnologyGroup
            title="Base de datos e integraciones"
            items={project.technologies.dataAndIntegrations}
          />
          <TechnologyGroup title="Despliegue" items={project.technologies.deployment} />
        </div>
      </SectionCard>

      <SectionCard title="Características principales" eyebrow="Funcionalidad">
        <BulletList items={project.features} />
      </SectionCard>

      <SectionCard title="Detalles técnicos / arquitectura" eyebrow="Opcional">
        <BulletList items={project.architectureDetails} />
      </SectionCard>
    </div>
  );
}
