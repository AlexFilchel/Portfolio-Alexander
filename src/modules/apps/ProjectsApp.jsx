import { useState } from 'react';
import { SectionCard } from '../../components/common/SectionCard';
import { projects } from '../../data/projects';
import { ProjectDetailView } from './ProjectDetailView';
import { ProjectsListView } from './ProjectsListView';

export function ProjectsApp() {
  const [selectedProjectSlug, setSelectedProjectSlug] = useState(null);
  const selectedProject = projects.find((project) => project.slug === selectedProjectSlug) ?? null;

  return (
    <div className="space-y-5">
      <SectionCard className="border-emerald-100 bg-[linear-gradient(135deg,#047857_0%,#0f766e_55%,#0f9f88_100%)] text-white">
        <h2 className="text-3xl font-semibold">Mis proyectos</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-emerald-50 md:text-base">
          Proyectos en los que desarrollo aplicaciones pensadas para funcionar correctamente y ofrecer una experiencia de uso clara.
        </p>
      </SectionCard>

      {selectedProject ? (
        <ProjectDetailView project={selectedProject} onBack={() => setSelectedProjectSlug(null)} />
      ) : (
        <ProjectsListView projects={projects} onSelectProject={setSelectedProjectSlug} />
      )}
    </div>
  );
}
