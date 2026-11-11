import { FileText, Globe, Monitor, Shield, Wrench, Zap } from 'lucide-react';

const services = [
  {
    icon: Globe,
    title: 'Développement Web',
    description: 'Création de sites vitrine, e-commerce et applications web sur mesure. Design moderne, responsive et optimisé pour le référencement.',
    tags: ['React', 'WordPress', 'SEO'],
    color: 'teal',
  },
  {
    icon: Monitor,
    title: 'Support Informatique',
    description: 'Dépannage, configuration et maintenance de vos équipements informatiques. Intervention rapide pour les particuliers et professionnels.',
    tags: ['Dépannage', 'Installation', 'Réseau'],
    color: 'emerald',
  },
  {
    icon: FileText,
    title: 'Gestion Administrative',
    description: 'Accompagnement dans la numérisation et organisation de vos documents administratifs. Création de formulaires et outils de gestion.',
    tags: ['Numérisation', 'Organisation', 'Outils'],
    color: 'cyan',
  },
  {
    icon: Wrench,
    title: 'Maintenance & Dépannage',
    description: 'Entretien régulier de vos postes de travail, mise à jour des systèmes et résolution rapide des pannes informatiques.',
    tags: ['PC', 'Mac', 'Serveur'],
    color: 'teal',
  },
  {
    icon: Shield,
    title: 'Sécurité Informatique',
    description: 'Audit et sécurisation de votre infrastructure. Installation d\'antivirus, pare-feux et bonnes pratiques de cybersécurité.',
    tags: ['Antivirus', 'Backup', 'VPN'],
    color: 'emerald',
  },
  {
    icon: Zap,
    title: 'Formation & Conseil',
    description: 'Formation personnalisée à l\'utilisation des outils numériques. Conseils adaptés à vos besoins et à votre niveau.',
    tags: ['Formation', 'Conseil', 'Suivi'],
    color: 'cyan',
  },
];

const colorMap: Record<string, string> = {
  teal: 'bg-teal-500/10 border-teal-500/20 text-teal-500',
  emerald: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500',
  cyan: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-500',
};

const iconColorMap: Record<string, string> = {
  teal: 'bg-teal-500/10 text-teal-500',
  emerald: 'bg-emerald-500/10 text-emerald-500',
  cyan: 'bg-cyan-500/10 text-cyan-500',
};

export default function Services() {
  return (
    <section id="services" className="theme-section py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="theme-chip inline-block text-xs font-semibold px-3 py-1.5 rounded-full uppercase tracking-widest mb-4">
            Ce que je propose
          </span>
          <h2 className="theme-text text-4xl font-extrabold mb-4">Mes Services</h2>
          <p className="theme-text-muted text-lg max-w-2xl mx-auto">
            Une gamme complète de services informatiques et numériques pour répondre à tous vos besoins, des particuliers aux entreprises.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <article
                key={service.title}
                className="theme-card rounded-2xl p-6 transition-transform duration-300 hover:-translate-y-1"
              >
                <div className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl ${iconColorMap[service.color]}`}>
                  <Icon size={22} />
                </div>
                <h3 className="theme-text mb-2 text-lg font-bold">{service.title}</h3>
                <p className="theme-text-muted mb-5 text-sm leading-relaxed">{service.description}</p>
                <div className="flex flex-wrap gap-2">
                  {service.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`rounded-full border px-2.5 py-1 text-xs font-medium ${colorMap[service.color]}`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
