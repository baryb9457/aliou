import { Moon, Sun } from 'lucide-react';

type Theme = 'light' | 'dark';

interface ThemeToggleProps {
  theme: Theme;
  onToggle: () => void;
}

export default function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={`Passer en mode ${isDark ? 'clair' : 'sombre'}`}
      className="theme-card inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium theme-text-soft hover:text-[var(--text-primary)]"
    >
      <span className="theme-icon-badge flex h-8 w-8 items-center justify-center rounded-full">
        {isDark ? <Sun size={16} /> : <Moon size={16} />}
      </span>
      <span className="hidden sm:inline">{isDark ? 'Clair' : 'Sombre'}</span>
    </button>
  );
}