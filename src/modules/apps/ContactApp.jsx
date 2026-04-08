import { SectionCard } from '../../components/common/SectionCard';

const contactItems = [
  {
    label: 'Nombre',
    value: 'Alexander Filchel',
  },
  {
    label: 'Email',
    value: 'filchelalexander@gmail.com',
    href: 'mailto:filchelalexander@gmail.com',
  },
  {
    label: 'Teléfono',
    value: '+54 2615157940',
    href: 'tel:+542615157940',
  },
  {
    label: 'Ubicación',
    value: 'Mendoza, Argentina',
  },
  {
    label: 'LinkedIn',
    value: 'linkedin.com/in/alexander-filchel',
    href: 'https://www.linkedin.com/in/alexander-filchel',
  },
  {
    label: 'GitHub',
    value: 'github.com/AlexFilchel',
    href: 'https://github.com/AlexFilchel',
  },
];

export function ContactApp() {
  return (
    <div className="space-y-5">
      <SectionCard className="border-[#0a7a5c]/15 bg-[linear-gradient(135deg,#005c46_0%,#006241_52%,#0a7a5c_100%)] text-white">
        <h2 className="text-3xl font-semibold">Contacto</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-emerald-50 md:text-base">
          Acá vas a encontrar mis datos de contacto y accesos directos a mis perfiles para que puedas escribirme, colaborar o conocer más sobre mi trabajo.
        </p>
      </SectionCard>

      <SectionCard title="Datos de contacto" eyebrow="Perfil" className="border-[#c9e7dd] bg-[#eef8f3]">
        <dl className="grid gap-4 md:grid-cols-2">
          {contactItems.map((item) => (
            <div key={item.label} className="rounded-2xl border border-[#c9e7dd] bg-white/70 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.65)] backdrop-blur-sm">
              <dt className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#006241]/80">{item.label}</dt>
              <dd className="mt-2 text-sm font-medium text-slate-700 md:text-[15px]">
                {item.href ? (
                  <a
                    href={item.href}
                    target={item.href.startsWith('http') ? '_blank' : undefined}
                    rel={item.href.startsWith('http') ? 'noreferrer' : undefined}
                    className="break-all text-[#006241] underline decoration-[#006241]/35 underline-offset-4 transition hover:text-[#004f35]"
                  >
                    {item.value}
                  </a>
                ) : (
                  item.value
                )}
              </dd>
            </div>
          ))}
        </dl>
      </SectionCard>
    </div>
  );
}
