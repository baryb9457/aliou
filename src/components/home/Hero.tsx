import { ArrowRight, CheckCircle } from 'lucide-react';

export default function Hero() {
  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="hero"
      className="theme-section relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      <div className="theme-hero-gradient absolute inset-0" />
      <div className="theme-hero-orbs absolute inset-0 opacity-70" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-32 grid md:grid-cols-2 gap-16 items-center">
        <div>
          <span className="theme-chip inline-block text-xs font-semibold px-3 py-1.5 rounded-full uppercase tracking-widest mb-6">
            Développeur & Technicien IT
          </span>
          <h1 className="theme-text text-5xl md:text-6xl font-extrabold leading-tight mb-6">
            Votre partenaire <span className="theme-brand">numérique</span> vous écoute et vous accompagne
          </h1>
          <p className="theme-text-muted text-lg leading-relaxed mb-8 max-w-xl">
            Développement web & mobile sur mesure, support informatique et gestion administrative. Aliou vous accompagne à chaque étape de votre transformation numérique.
          </p>

          <ul className="space-y-2 mb-10">
            {[
              'Sites web modernes et performants',
              'Dépannage et maintenance informatique',
              'Accompagnement administratif digitalisé',
            ].map((item) => (
              <li key={item} className="flex items-center gap-2.5 theme-text-soft text-sm">
                <CheckCircle size={16} className="theme-brand shrink-0" />
                {item}
              </li>
            ))}
          </ul>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={scrollToContact}
              className="theme-brand-button flex items-center justify-center gap-2 font-semibold px-7 py-3.5 rounded-xl active:scale-95"
            >
              Demander un devis
              <ArrowRight size={18} />
            </button>
            <button
              onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
              className="theme-ghost-button flex items-center justify-center gap-2 font-semibold px-7 py-3.5 rounded-xl"
            >
              Voir les services
            </button>
          </div>
        </div>

        <div className="hidden md:flex justify-center">
          <div className="relative w-80 h-80">
            <div className="absolute inset-0 rounded-3xl rotate-6 theme-chip" />
            <div className="absolute inset-0 theme-panel rounded-3xl backdrop-blur-sm p-8 flex flex-col justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="space-y-3">
                <div className="h-2.5 bg-teal-500/40 rounded w-3/4" />
                <div className="h-2.5 bg-slate-500/40 rounded w-full" />
                <div className="h-2.5 bg-slate-500/40 rounded w-5/6" />
                <div className="h-2.5 bg-slate-500/40 rounded w-2/3" />
                <div className="h-2.5 bg-emerald-500/35 rounded w-4/5" />
                <div className="h-2.5 bg-slate-500/40 rounded w-full" />
                <div className="h-2.5 bg-slate-500/40 rounded w-3/4" />
                <div className="h-8 theme-chip rounded-lg mt-4 flex items-center px-3">
                  <div className="h-2 bg-teal-500/60 rounded w-1/2" />
                </div>
              </div>
              <div className="theme-brand text-xs font-mono">$ npm run dev ...</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
