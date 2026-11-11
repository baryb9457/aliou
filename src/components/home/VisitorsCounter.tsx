import { useEffect, useState } from 'react';
import { Users } from 'lucide-react';
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
    <section className="theme-section-alt px-6 pb-12 md:pb-16" aria-label="Statistiques de visites">
      <div className="max-w-6xl mx-auto">
        <div className="visitor-card theme-card relative overflow-hidden rounded-3xl p-7 md:px-10 md:py-8">
          <div className="visitor-card-glow" aria-hidden="true" />
          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <span className="theme-icon-badge flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl">
                <Users size={21} />
              </span>
              <div>
                <p className="theme-brand mb-1 text-xs font-semibold uppercase tracking-[0.18em]">
                  La communauté KAM
                </p>
                <h2 className="theme-text text-xl font-bold md:text-2xl">Merci de votre visite</h2>
                <p className="theme-text-muted mt-1 text-sm">
                  Visiteurs uniques depuis la mise en ligne du site
                </p>
              </div>
            </div>

            <div className="sm:border-l sm:pl-8 theme-divider">
              <p className="theme-text text-4xl font-extrabold tabular-nums md:text-5xl" aria-live="polite">
                {totalVisitors === null ? '—' : totalVisitors.toLocaleString('fr-FR')}
              </p>
              <p className="theme-text-muted mt-1 text-xs font-medium uppercase tracking-wider">
                Visiteurs
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
