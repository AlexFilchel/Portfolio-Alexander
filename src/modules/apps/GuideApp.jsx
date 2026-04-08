import { SectionCard } from '../../components/common/SectionCard';

const availableApps = [
  {
    title: 'Sobre mí',
    description: 'Se abre automáticamente al cargar la página y resume perfil, formación y stack.',
  },
  {
    title: 'Descargar CV',
    description: 'Abre un cuadro de confirmación centrado para descargar el PDF o cancelar.',
  },
  {
    title: 'Contacto',
    description: 'Muestra email, teléfono, ubicación y enlaces directos a LinkedIn y GitHub.',
  },
  {
    title: 'Cómo funciona la página',
    description: 'Explica cómo usar el escritorio, la búsqueda, la taskbar y las ventanas.',
  },
  {
    title: 'Mis proyectos',
    description: 'Empieza con un listado de proyectos y permite abrir una vista detalle con botón Volver.',
  },
];

const usageSteps = [
  {
    title: 'Abrir aplicaciones desde escritorio y taskbar',
    description:
      'En el escritorio las apps se abren con doble click sobre el ícono. En la taskbar alcanza con un click: si la app está cerrada se abre, si está minimizada se restaura y si ya está abierta se enfoca.',
  },
  {
    title: 'Mover iconos del escritorio',
    description:
      'Podés arrastrar y soltar los íconos con el mouse. Al soltarlos, se acomodan a la grilla del escritorio, intercambian lugar si caen sobre otro ícono y la posición queda guardada en el navegador para próximas visitas.',
  },
  {
    title: 'Usar la barra de búsqueda',
    description:
      'La lupa de la taskbar abre una búsqueda que hoy filtra aplicaciones por título, descripción y palabras clave. Podés escribir, moverte con las flechas, abrir con Enter, hacer click en un resultado y cerrar con Escape o haciendo click afuera.',
  },
  {
    title: 'Entender la taskbar / barra de tareas',
    description:
      'La barra muestra la búsqueda, las cinco apps fijadas y un indicador inferior cuando una app está abierta o activa. Si hacés click en la ventana activa desde la taskbar, esa ventana estándar se minimiza. A la derecha también se muestran hora y fecha.',
  },
  {
    title: 'Mover, minimizar, maximizar y restaurar ventanas',
    description:
      'Las ventanas normales se pueden arrastrar desde la barra superior y redimensionar desde bordes y esquinas. Los controles de arriba permiten minimizar, maximizar o restaurar, y el doble click sobre la barra superior también alterna entre maximizada y restaurada.',
  },
  {
    title: 'Qué pasa al maximizar o cerrar',
    description:
      'Cuando una ventana estándar está maximizada, la taskbar se oculta hasta restaurarla. El botón rojo cierra la ventana actual, pero siempre la podés volver a abrir desde el escritorio o desde la taskbar.',
  },
  {
    title: 'Detalles útiles de la experiencia',
    description:
      'Sobre mí se abre automáticamente al entrar. Descargar CV funciona como diálogo fijo, sin minimizar, maximizar ni redimensionar. Si arrastrás una ventana maximizada desde la barra superior, primero se restaura y después sigue el movimiento.',
  },
];

export function GuideApp() {
  return (
    <div className="space-y-5">
      <SectionCard className="border-slate-200 bg-[linear-gradient(135deg,#111827_0%,#374151_55%,#6b7280_100%)] text-white">
        <h2 className="text-3xl font-semibold">Cómo funciona la página</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-100 md:text-base">
          Guía actualizada según el funcionamiento real del portfolio para que puedas ubicarte rápido y entender cómo interactuar con el escritorio.
        </p>
      </SectionCard>

      <SectionCard title="Qué aplicaciones hay" eyebrow="Apps" className="border-slate-200 bg-slate-50/70">
        <div className="grid gap-3 md:grid-cols-2">
          {availableApps.map((app) => (
            <div key={app.title} className="rounded-2xl border border-slate-200 bg-white/80 p-4">
              <h3 className="text-sm font-semibold text-slate-900">{app.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{app.description}</p>
            </div>
          ))}
        </div>
      </SectionCard>

      <div className="grid gap-4">
        {usageSteps.map((step, index) => (
          <SectionCard key={step.title} className="flex gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-200 text-sm font-semibold text-slate-700">
              0{index + 1}
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900">{step.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{step.description}</p>
            </div>
          </SectionCard>
        ))}
      </div>

      <SectionCard title="Consejo de navegación" eyebrow="UX" className="border-slate-200 bg-slate-50/70">
        <p className="text-sm leading-6 text-slate-600">
          Si querés recorrer todo rápido, empezá por Sobre mí, seguí con Mis proyectos y dejá Contacto o Descargar CV para el final.
        </p>
      </SectionCard>
    </div>
  );
}
