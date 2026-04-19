import { useState, useEffect } from 'react';
import { isSupabaseConfigured, supabase } from './lib/supabase';
import type { Session } from '@supabase/supabase-js';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Hero from './components/home/Hero';
import Services from './components/home/Services';
import Testimonials from './components/home/Testimonials';
import Contact from './components/home/Contact';
import AdminLogin from './components/admin/AdminLogin';
import AdminDashboard from './components/admin/AdminDashboard';

type View = 'home' | 'admin-login' | 'admin-dashboard';
type Theme = 'light' | 'dark';

const getInitialTheme = (): Theme => {
  if (typeof window === 'undefined') {
    return 'dark';
  }

  const storedTheme = window.localStorage.getItem('kam-theme');
  if (storedTheme === 'light' || storedTheme === 'dark') {
    return storedTheme;
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export default function App() {
  const [view, setView] = useState<View>('home');
  const [session, setSession] = useState<Session | null>(null);
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setSession(null);
      return;
    }

    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    window.localStorage.setItem('kam-theme', theme);
  }, [theme]);

  const handleAdminClick = () => {
    if (session) {
      setView('admin-dashboard');
    } else {
      setView('admin-login');
    }
  };

  if (view === 'admin-login') {
    return (
      <AdminLogin
        theme={theme}
        onThemeToggle={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))}
        onSuccess={() => setView('admin-dashboard')}
        onBack={() => setView('home')}
      />
    );
  }

  if (view === 'admin-dashboard' && session) {
    return (
      <AdminDashboard
        theme={theme}
        onThemeToggle={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))}
        onLogout={() => setView('home')}
      />
    );
  }

  return (
    <div className="theme-shell font-sans">
      <Header
        theme={theme}
        onThemeToggle={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))}
        onAdminClick={handleAdminClick}
      />
      <main>
        <Hero />
        <Services />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
