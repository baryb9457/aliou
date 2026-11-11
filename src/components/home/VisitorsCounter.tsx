import { useEffect, useState } from 'react';
import { Users, X } from 'lucide-react';
import { getTotalVisitors, trackVisitor } from '../../lib/visitors';

export default function VisitorsCounter() {
  const [totalVisitors, setTotalVisitors] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadVisitors = async () => {
      try {
        await trackVisitor();
        const total = await getTotalVisitors();
        if (isMounted) {
          setTotalVisitors(total);
        }
      } catch (error) {
        console.error('Visitor statistics could not be loaded:', error);
      }
    };

    void loadVisitors();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <aside className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3">
      {isOpen && (
        <section
          id="visitor-counter-panel"
          aria-label="Statistiques de visites"
          className="visitor-card theme-card relative w-[min(20rem,calc(100vw-2.5rem))] overflow-hidden rounded-2xl p-5 shadow-2xl"
        >
          <div className="visitor-card-glow" aria-hidden="true" />
          <div className="relative flex items-start justify-between gap-4">
            <div>
              <p className="theme-brand mb-1 text-xs font-semibold uppercase tracking-[0.16em]">
                Statistiques du site
              </p>
              <h2 className="theme-text text-base font-bold">Visiteurs uniques</h2>
              <p className="theme-text-muted mt-1 text-xs">Depuis la mise en ligne du site</p>
            </div>
            <p className="theme-text text-3xl font-extrabold tabular-nums" aria-live="polite">
              {totalVisitors === null ? '—' : totalVisitors.toLocaleString('fr-FR')}
            </p>
          </div>
        </section>
      )}

      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={isOpen ? 'visitor-counter-panel' : undefined}
        aria-label={isOpen ? 'Fermer le compteur de visiteurs' : 'Afficher le compteur de visiteurs'}
        onClick={() => setIsOpen((open) => !open)}
        className="theme-brand-button flex items-center gap-2 rounded-full px-4 py-3 text-sm font-semibold shadow-lg"
      >
        {isOpen ? <X size={17} /> : <Users size={17} />}
        <span>{isOpen ? 'Fermer' : 'Visiteurs'}</span>
      </button>
    </aside>
  );
}
