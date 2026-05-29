import { Globe, Monitor, FileText, ArrowRight } from 'lucide-react';

const projects = [
  {
    icon: Globe,
    title: 'Site vitrine professionnel',
    audience: 'Entrepreneurs, associations et petites structures',
    description:
      'Présentation claire de l’activité, des services proposés et des moyens de contact pour rassurer les visiteurs et faciliter la prise de rendez-vous.',
    points: ['Pages de présentation structurées', 'Design responsive', 'Mise en ligne prête à être partagée'],
  },
  {
    icon: Monitor,
    title: 'Projet informatique sur mesure',
    audience: 'Particuliers et professionnels',
    description:
      'Accompagnement technique pour résoudre un besoin concret : optimisation d’un poste, sécurisation d’un environnement ou amélioration d’un usage quotidien.',
    points: ['Diagnostic du besoin', 'Solution adaptée au matériel existant', 'Suivi après intervention'],
  },
  {
    icon: FileText,
    title: 'Organisation administrative numérique',
    audience: 'Indépendants, familles et structures locales',
    description:
      'Création d’outils simples pour mieux gérer les documents, formulaires et démarches, avec des explications compréhensibles pour tous.',
    points: ['Documents centralisés', 'Processus simplifiés', 'Utilisation facile au quotidien'],
  },
];

export default function Projects() {
  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="projects" className="theme-section-alt py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="theme-chip inline-block text-xs font-semibold px-3 py-1.5 rounded-full uppercase tracking-widest mb-4">
            Projets publiés
          </span>
          <h2 className="theme-text text-4xl font-extrabold mb-4">Des projets expliqués clairement</h2>
          <p className="theme-text-muted text-lg max-w-3xl mx-auto">
            Cette section donne plus de visibilité sur les projets que je peux publier et livrer, afin que chaque
            visiteur comprenne rapidement le besoin traité, le public concerné et la valeur apportée.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {projects.map((project) => {
            const Icon = project.icon;

            return (
              <article key={project.title} className="theme-card rounded-2xl p-6 h-full flex flex-col">
                <div className="theme-icon-badge w-12 h-12 rounded-xl flex items-center justify-center mb-5">
                  <Icon size={22} />
                </div>

                <div className="flex items-center justify-between gap-3 mb-4">
                  <h3 className="theme-text text-xl font-bold">{project.title}</h3>
                  <span className="theme-chip-neutral text-xs px-2.5 py-1 rounded-full whitespace-nowrap">
                    Publié
                  </span>
                </div>

                <p className="theme-text-soft text-sm font-medium mb-3">{project.audience}</p>
                <p className="theme-text-muted text-sm leading-relaxed mb-5">{project.description}</p>

                <ul className="space-y-3 mb-6 flex-1">
                  {project.points.map((point) => (
                    <li key={point} className="flex items-start gap-2.5 theme-text-soft text-sm">
                      <span className="theme-brand mt-0.5">•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <button
            type="button"
            onClick={scrollToContact}
            className="theme-brand-button inline-flex items-center justify-center gap-2 font-semibold px-7 py-3.5 rounded-xl active:scale-95"
          >
            Parler de votre projet
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}
