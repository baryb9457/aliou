import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import KamLogo from './KamLogo';

interface HeaderProps {
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
  onAdminClick: () => void;
}

export default function Header({ theme, onThemeToggle, onAdminClick }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'theme-header-solid' : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <button onClick={() => scrollTo('hero')} className="flex items-center gap-2 group">
          <KamLogo
            size="sm"
            markClassName="transition-transform duration-200 group-hover:-translate-y-0.5"
            textClassName="theme-text"
          />
        </button>

        <nav className="hidden md:flex items-center gap-8">
          {[
            { label: 'Services', id: 'services' },
            { label: 'Témoignages', id: 'testimonials' },
            { label: 'Contact', id: 'contact' },
          ].map(({ label, id }) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className="theme-text-soft hover:text-[var(--text-primary)] text-sm font-medium tracking-wide transition-colors"
            >
              {label}
            </button>
          ))}
          <ThemeToggle theme={theme} onToggle={onThemeToggle} />
          <button
            onClick={onAdminClick}
            className="theme-brand-button text-sm font-semibold px-4 py-2 rounded-lg"
          >
            Admin
          </button>
        </nav>

        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle theme={theme} onToggle={onThemeToggle} />
          <button
            className="theme-text"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden theme-card border-x-0 border-b-0 rounded-none px-6 py-4 flex flex-col gap-4">
          {[
            { label: 'Services', id: 'services' },
            { label: 'Témoignages', id: 'testimonials' },
            { label: 'Contact', id: 'contact' },
          ].map(({ label, id }) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className="theme-text-soft hover:text-[var(--text-primary)] text-sm font-medium text-left transition-colors"
            >
              {label}
            </button>
          ))}
          <button
            onClick={() => { onAdminClick(); setMenuOpen(false); }}
            className="theme-brand-button text-sm font-semibold px-4 py-2 rounded-lg w-full"
          >
            Espace Admin
          </button>
        </div>
      )}
    </header>
  );
}
