import { useEffect, useState } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';

const testimonials = [
  {
    name: 'Marie Lefebvre',
    role: 'Gérante, Boutique Mode',
    avatar: 'ML',
    rating: 5,
    text: 'KAM a créé mon site e-commerce en un temps record. Le résultat est magnifique, professionnel et mes ventes ont augmenté de 40% en 3 mois. Je recommande vivement !',
    service: 'Développement Web',
  },
  {
    name: 'Thomas Renaud',
    role: 'Directeur PME',
    avatar: 'TR',
    rating: 5,
    text: 'Intervention rapide pour dépanner notre réseau d\'entreprise. Très compétent, explications claires et tarifs honnêtes. Notre partenaire IT de confiance depuis 2 ans.',
    service: 'Support Informatique',
  },
  {
    name: 'Sophie Martin',
    role: 'Auto-entrepreneuse',
    avatar: 'SM',
    rating: 5,
    text: 'J\'avais besoin d\'aide pour numériser et organiser ma comptabilité. KAM a mis en place un système simple et efficace. Gain de temps considérable au quotidien !',
    service: 'Gestion Administrative',
  },
  {
    name: 'Ahmed Benali',
    role: 'Particulier',
    avatar: 'AB',
    rating: 5,
    text: 'Mon ordinateur était très lent et plein de virus. KAM l\'a nettoyé, mis à jour et maintenant il fonctionne comme neuf. Service rapide et très sympa.',
    service: 'Maintenance',
  },
  {
    name: 'Claire Dubois',
    role: 'Responsable association',
    avatar: 'CD',
    rating: 5,
    text: 'Création d\'un site vitrine pour notre association avec espace membres. KAM a été à l\'écoute de nos besoins bénévoles et a livré exactement ce qu\'on voulait.',
    service: 'Développement Web',
  },
  {
    name: 'Paul Girard',
    role: 'Retraité',
    avatar: 'PG',
    rating: 5,
    text: 'Patience et pédagogie remarquables pour m\'apprendre à utiliser mon nouvel ordinateur. KAM explique tout simplement sans jargon technique. Merci !',
    service: 'Formation',
  },
];

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 4500);

    return () => window.clearInterval(intervalId);
  }, []);

  const goToPrev = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToNext = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const getSlideState = (index: number) => {
    if (index === activeIndex) {
      return 'opacity-100 translate-x-0 scale-100 z-20';
    }

    if (index === (activeIndex + 1) % testimonials.length) {
      return 'opacity-0 translate-x-10 scale-95 z-10';
    }

    if (index === (activeIndex - 1 + testimonials.length) % testimonials.length) {
      return 'opacity-0 -translate-x-10 scale-95 z-10';
    }

    return 'opacity-0 scale-95 z-0';
  };

  return (
    <section id="testimonials" className="theme-section-alt py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="theme-chip inline-block text-xs font-semibold px-3 py-1.5 rounded-full uppercase tracking-widest mb-4">
            Ce qu'ils disent
          </span>
          <h2 className="theme-text text-4xl font-extrabold mb-4">Témoignages Clients</h2>
          <p className="theme-text-muted text-lg max-w-2xl mx-auto">
            La satisfaction de mes clients est ma priorité. Découvrez leurs retours d'expérience.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="relative min-h-[300px] sm:min-h-[260px]">
            {testimonials.map((t, index) => (
              <article
                key={t.name}
                className={`theme-card rounded-2xl p-6 sm:p-7 flex flex-col absolute inset-0 transition-all duration-700 ease-out ${getSlideState(index)}`}
                aria-hidden={index !== activeIndex}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="theme-chip w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0">
                      {t.avatar}
                    </div>
                    <div>
                      <p className="theme-text font-semibold text-sm">{t.name}</p>
                      <p className="theme-text-muted text-xs">{t.role}</p>
                    </div>
                  </div>
                  <Quote size={18} className="theme-brand shrink-0 opacity-40" />
                </div>

                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} size={13} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>

                <p className="theme-text-muted text-sm leading-relaxed flex-1 mb-4">"{t.text}"</p>

                <span className="theme-chip-neutral inline-block text-xs px-2.5 py-1 rounded-full self-start">
                  {t.service}
                </span>
              </article>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={goToPrev}
              aria-label="Témoignage précédent"
              className="theme-card w-10 h-10 rounded-full flex items-center justify-center theme-text hover:opacity-80 transition"
            >
              <ChevronLeft size={18} />
            </button>

            <div className="flex items-center gap-2">
              {testimonials.map((t, index) => (
                <button
                  key={t.name}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  aria-label={`Afficher le témoignage ${index + 1}`}
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
              aria-label="Témoignage suivant"
              className="theme-card w-10 h-10 rounded-full flex items-center justify-center theme-text hover:opacity-80 transition"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div className="mt-12 text-center">
          <div className="theme-card inline-flex items-center gap-6 rounded-2xl px-8 py-5">
            {[
              { value: '150+', label: 'Clients satisfaits' },
              { value: '98%', label: 'Taux de satisfaction' },
              { value: '2 ans', label: "D'expérience" },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <p className="text-2xl font-extrabold theme-brand">{value}</p>
                <p className="theme-text-muted text-xs mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
