import { useState } from 'react';
import { Lock, Mail, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import ThemeToggle from '../layout/ThemeToggle';
import KamLogo from '../layout/KamLogo';

interface AdminLoginProps {
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
  onSuccess: () => void;
  onBack: () => void;
}

export default function AdminLogin({ theme, onThemeToggle, onSuccess, onBack }: AdminLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getFriendlyAuthError = (message: string) => {
    const normalized = message.toLowerCase();

    if (normalized.includes('email not confirmed')) {
      return 'Votre email n est pas confirme. Verifiez votre boite mail et confirmez le compte.';
    }

    if (normalized.includes('invalid login credentials')) {
      return 'Email ou mot de passe incorrect.';
    }

    return `Connexion impossible: ${message}`;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const emailValue = email.trim().toLowerCase();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: emailValue,
      password,
    });

    setLoading(false);
    if (authError) {
      setError(getFriendlyAuthError(authError.message));
      console.error('Admin login error:', authError.message);
    } else {
      onSuccess();
    }
  };

  return (
    <div className="theme-shell min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="flex justify-end mb-4">
          <ThemeToggle theme={theme} onToggle={onThemeToggle} />
        </div>
        <div className="text-center mb-8">
          <KamLogo className="justify-center mb-4" size="lg" textClassName="theme-text items-center" />
          <h1 className="theme-text text-2xl font-extrabold">Espace Admin KAM</h1>
          <p className="theme-text-muted text-sm mt-1">Connectez-vous pour accéder au tableau de bord.</p>
        </div>

        <div className="theme-card rounded-2xl p-8">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block theme-text-soft text-sm font-medium mb-1.5">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 theme-text-muted" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="theme-input w-full rounded-xl pl-10 pr-4 py-2.5 text-sm"
                  placeholder="admin@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block theme-text-soft text-sm font-medium mb-1.5">Mot de passe</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 theme-text-muted" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="theme-input w-full rounded-xl pl-10 pr-4 py-2.5 text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3">
                <AlertCircle size={15} />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="theme-brand-button w-full flex items-center justify-center gap-2 disabled:opacity-50 font-semibold py-3 rounded-xl active:scale-95 mt-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'Se connecter'
              )}
            </button>
          </form>
        </div>

        <button
          onClick={onBack}
          className="w-full mt-4 theme-text-muted hover:text-[var(--text-primary)] text-sm text-red-500 text-center"
        >
          Contactez moi via le formulaire de contact
        </button>
      </div>
    </div>
  );
}
