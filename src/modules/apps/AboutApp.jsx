import { SectionCard } from '../../components/common/SectionCard';
import { profileSummary } from '../../data/profile';

export function AboutApp() {
  return (
    <div className="space-y-5">
      <SectionCard className="overflow-hidden border-sky-100 bg-[linear-gradient(135deg,#0f172a_0%,#17355f_54%,#1f6ee9_100%)] text-white">
        <div className="flex flex-col gap-6 md:flex-row md:items-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-[28px] border border-white/20 bg-white/10 text-3xl font-semibold text-white shadow-lg shadow-black/10">
            AF
          </div>

          <div className="space-y-3">
            <div>
              <h2 className="text-3xl font-semibold">{profileSummary.name}</h2>
              <p className="mt-2 text-sm text-slate-200 md:text-base">{profileSummary.role}</p>
            </div>

            <p className="max-w-2xl text-sm leading-6 text-slate-200/95 md:text-base">
              {profileSummary.tagline}
            </p>
          </div>
        </div>
      </SectionCard>

      <div className="grid gap-5 xl:grid-cols-[1.4fr,1fr]">
        <SectionCard title="Perfil profesional" eyebrow="Resumen">
          <div className="space-y-4 text-sm leading-6 text-slate-600">
            {profileSummary.bio.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Formación académica" eyebrow="Trayectoria">
          <ul className="space-y-4 text-sm text-slate-600">
            {profileSummary.education.map((item) => (
              <li key={`${item.institution}-${item.program}`} className="flex gap-3">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-sky-500" />
                <div>
                  <p className="font-semibold text-slate-700">{item.institution}</p>
                  <p>{item.program}</p>
                  <p className="text-xs text-slate-500">{item.period}</p>
                </div>
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>

      <div className="grid gap-5">
        <SectionCard title="Tecnologías dominadas" eyebrow="Stack">
          <div className="grid gap-4 md:grid-cols-2">
            {profileSummary.technologyGroups.map((group) => (
              <div key={group.title} className="rounded-2xl border border-sky-100 bg-sky-50/70 p-4">
                <p className="text-sm font-semibold text-slate-700">{group.title}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <span
                      key={`${group.title}-${item}`}
                      className="rounded-xl border border-sky-100 bg-white px-3 py-1.5 text-xs font-semibold text-sky-700"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
