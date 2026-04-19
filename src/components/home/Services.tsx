import { useEffect, useState } from 'react';
import { Globe, Monitor, FileText, Wrench, Shield, Zap, ChevronLeft, ChevronRight } from 'lucide-react';

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
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % services.length);
    }, 4200);

    return () => window.clearInterval(intervalId);
  }, []);

  const goToPrev = () => {
    setActiveIndex((prev) => (prev - 1 + services.length) % services.length);
  };

  const goToNext = () => {
    setActiveIndex((prev) => (prev + 1) % services.length);
  };

  const getSlideState = (index: number) => {
    if (index === activeIndex) {
      return 'opacity-100 translate-x-0 scale-100 z-20';
    }

    if (index === (activeIndex + 1) % services.length) {
      return 'opacity-0 translate-x-10 scale-95 z-10';
    }

    if (index === (activeIndex - 1 + services.length) % services.length) {
      return 'opacity-0 -translate-x-10 scale-95 z-10';
    }

    return 'opacity-0 scale-95 z-0';
  };

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

        <div className="max-w-3xl mx-auto">
          <div className="relative min-h-[310px] sm:min-h-[270px]">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <article
                  key={service.title}
                  className={`theme-card rounded-2xl p-6 sm:p-7 group absolute inset-0 transition-all duration-700 ease-out ${getSlideState(index)}`}
                  aria-hidden={index !== activeIndex}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${iconColorMap[service.color]}`}>
                    <Icon size={22} />
                  </div>
                  <h3 className="theme-text font-bold text-lg mb-2 group-hover:text-teal-500 transition-colors">{service.title}</h3>
                  <p className="theme-text-muted text-sm leading-relaxed mb-4">{service.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {service.tags.map((tag) => (
                      <span
                        key={tag}
                        className={`text-xs px-2.5 py-1 rounded-full border font-medium ${colorMap[service.color]}`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </article>
              );
            })}
          </div>

          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={goToPrev}
              aria-label="Service précédent"
              className="theme-card w-10 h-10 rounded-full flex items-center justify-center theme-text hover:opacity-80 transition"
            >
              <ChevronLeft size={18} />
            </button>

            <div className="flex items-center gap-2">
              {services.map((service, index) => (
                <button
                  key={service.title}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  aria-label={`Afficher le service ${index + 1}`}
                  className={`h-2.5 rounded-full transition-all ${
                    activeIndex === index
                      ? 'w-7 theme-brand-bg'
                      : 'w-2.5 bg-[color:var(--theme-border)] hover:bg-[color:var(--theme-brand)]/60'
                  }`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={goToNext}
              aria-label="Service suivant"
              className="theme-card w-10 h-10 rounded-full flex items-center justify-center theme-text hover:opacity-80 transition"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
