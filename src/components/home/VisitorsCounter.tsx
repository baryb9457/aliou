import { useEffect, useState } from 'react';
import { Users, Activity, Clock3 } from 'lucide-react';
import { getTotalVisitors, trackVisitor } from '../../lib/visitors';

export default function VisitorsCounter() {
  const [totalVisitors, setTotalVisitors] = useState<number | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadVisitors = async () => {
      await trackVisitor();
      const total = await getTotalVisitors();

      if (isMounted) {
        setTotalVisitors(total);
      }
    };

    void loadVisitors();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="theme-section-alt py-16 px-6" aria-label="Statistiques de visites">
      <div className="max-w-6xl mx-auto">
        <div className="theme-card rounded-3xl p-6 md:p-10">
          <div className="grid md:grid-cols-3 gap-5 md:gap-8 items-center">
            <article className="theme-panel rounded-2xl p-5 md:p-6 flex flex-col items-center justify-center min-h-[124px]">
              <div className="theme-icon-badge w-9 h-9 rounded-lg flex items-center justify-center mb-3">
                <Users size={16} />
              </div>
              <p className="theme-text text-3xl md:text-4xl font-extrabold">
                {totalVisitors === null ? '...' : totalVisitors.toLocaleString('fr-FR')}
              </p>
            </article>

            <article className="theme-panel rounded-2xl p-5 md:p-6 flex items-center justify-center min-h-[124px]" aria-label="Compteur actif">
              <div className="theme-icon-badge w-9 h-9 rounded-lg flex items-center justify-center">
                <Activity size={16} />
              </div>
            </article>

            <article className="theme-panel rounded-2xl p-5 md:p-6 flex items-center justify-center min-h-[124px]" aria-label="Mise a jour continue">
              <div className="theme-icon-badge w-9 h-9 rounded-lg flex items-center justify-center">
                <Clock3 size={16} />
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
