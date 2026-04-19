import { useState } from 'react';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { ServiceType } from '../../types';
import { sendContactNotification } from '../../lib/email';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
const MIN_MESSAGE_LENGTH = 20;
const MIN_FORM_FILL_MS = 2500;
const MIN_SUBMIT_INTERVAL_MS = 30000;

const serviceOptions: { value: ServiceType; label: string }[] = [
  { value: 'web', label: 'Développement Web' },
  { value: 'it', label: 'Support Informatique' },
  { value: 'admin', label: 'Gestion Administrative' },
  { value: 'other', label: 'Autre' },
];

export default function Contact() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    service_type: 'other' as ServiceType,
    message: '',
  });
  const [honeypot, setHoneypot] = useState('');
  const [formStartedAt, setFormStartedAt] = useState(() => Date.now());
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const resetForm = () => {
    setForm({ name: '', email: '', phone: '', service_type: 'other', message: '' });
    setHoneypot('');
    setFormStartedAt(Date.now());
  };

  const validateForm = () => {
    const trimmedName = form.name.trim();
    const trimmedEmail = form.email.trim().toLowerCase();
    const trimmedMessage = form.message.trim();
    const formFillDuration = Date.now() - formStartedAt;
    const lastSubmitAt = Number(window.localStorage.getItem('contact_last_submit_at') || '0');

    if (honeypot.trim().length > 0) {
      return { ok: false, message: 'Requête suspecte détectée.' };
    }

    if (formFillDuration < MIN_FORM_FILL_MS) {
      return { ok: false, message: 'Veuillez prendre un moment pour compléter le formulaire.' };
    }

    if (Date.now() - lastSubmitAt < MIN_SUBMIT_INTERVAL_MS) {
      return { ok: false, message: 'Veuillez patienter quelques secondes avant un nouvel envoi.' };
    }

    if (trimmedName.length < 2) {
      return { ok: false, message: 'Le nom doit contenir au moins 2 caractères.' };
    }

    if (!EMAIL_REGEX.test(trimmedEmail) || trimmedEmail.includes('..')) {
      return { ok: false, message: 'Veuillez saisir une adresse email valide.' };
    }

    if (trimmedMessage.length < MIN_MESSAGE_LENGTH) {
      return { ok: false, message: `Votre message doit contenir au moins ${MIN_MESSAGE_LENGTH} caractères.` };
    }

    return {
      ok: true,
      payload: {
        ...form,
        name: trimmedName,
        email: trimmedEmail,
        phone: form.phone.trim(),
        message: trimmedMessage,
      },
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);
    setStatus('idle');

    const validation = validateForm();
    if (!validation.ok || !validation.payload) {
      setStatus('error');
      setErrorMessage(validation.message || 'Requête invalide.');
      setLoading(false);
      return;
    }

    const { error } = await supabase.from('contact_requests').insert([validation.payload]);

    setLoading(false);
    if (error) {
      setStatus('error');
      setErrorMessage('Une erreur est survenue. Veuillez réessayer.');
    } else {
      window.localStorage.setItem('contact_last_submit_at', String(Date.now()));
      try {
        await sendContactNotification(validation.payload);
        setStatus('success');
        resetForm();
      } catch (emailError) {
        console.error('EmailJS notification failed', emailError);
        setStatus('error');
        setErrorMessage('Votre demande est enregistrée, mais l envoi email a échoué. Vérifiez la configuration EmailJS (service/template/public key).');
        return;
      }
    }
  };

  return (
    <section id="contact" className="theme-section py-24 px-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-start">
        <div>
          <span className="theme-chip inline-block text-xs font-semibold px-3 py-1.5 rounded-full uppercase tracking-widest mb-4">
            Parlons de votre projet
          </span>
          <h2 className="theme-text text-4xl font-extrabold mb-4">Contactez-moi</h2>
          <p className="theme-text-muted text-lg leading-relaxed mb-8">
            Vous avez un projet web, un problème informatique ou besoin d'un accompagnement administratif ? Décrivez votre besoin et je vous réponds rapidement avec un devis personnalisé.
          </p>
          <ul className="space-y-4">
            {[
              { icon: '⚡', title: 'Réponse rapide', desc: 'Je réponds sous 24h ouvrées.' },
              { icon: '💬', title: 'Devis gratuit', desc: 'Estimation sans engagement pour votre projet.' },
              { icon: '🎯', title: 'Sur mesure', desc: 'Solutions adaptées à votre budget et vos besoins.' },
            ].map(({ icon, title, desc }) => (
              <li key={title} className="flex items-start gap-3">
                <span className="text-xl mt-0.5">{icon}</span>
                <div>
                  <p className="theme-text font-semibold text-sm">{title}</p>
                  <p className="theme-text-muted text-sm">{desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="theme-card rounded-2xl p-8">
          {status === 'success' ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <CheckCircle size={48} className="text-green-400 mb-4" />
              <h3 className="theme-text font-bold text-xl mb-2">Message envoyé !</h3>
              <p className="theme-text-muted text-sm">Je vous recontacte très prochainement avec un devis.</p>
              <button
                onClick={() => setStatus('idle')}
                className="theme-link mt-6 text-sm underline underline-offset-2"
              >
                Envoyer une autre demande
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                className="hidden"
                aria-hidden="true"
                name="company_website"
              />

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block theme-text-soft text-sm font-medium mb-1.5">Nom complet *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="theme-input w-full rounded-xl px-4 py-2.5 text-sm"
                    placeholder="Jean Dupont"
                  />
                </div>
                <div>
                  <label className="block theme-text-soft text-sm font-medium mb-1.5">Email *</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="theme-input w-full rounded-xl px-4 py-2.5 text-sm"
                    placeholder="jean@exemple.fr"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block theme-text-soft text-sm font-medium mb-1.5">Téléphone</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="theme-input w-full rounded-xl px-4 py-2.5 text-sm"
                    placeholder="06 00 00 00 00"
                  />
                </div>
                <div>
                  <label className="block theme-text-soft text-sm font-medium mb-1.5">Service souhaité *</label>
                  <select
                    required
                    value={form.service_type}
                    onChange={(e) => setForm({ ...form, service_type: e.target.value as ServiceType })}
                    className="theme-input w-full rounded-xl px-4 py-2.5 text-sm"
                  >
                    {serviceOptions.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block theme-text-soft text-sm font-medium mb-1.5">Votre message *</label>
                <textarea
                  required
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="theme-input w-full rounded-xl px-4 py-2.5 text-sm resize-none"
                  placeholder="Décrivez votre projet ou votre besoin..."
                />
              </div>

              {status === 'error' && (
                <div className="flex items-center gap-2 text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3">
                  <AlertCircle size={16} />
                  {errorMessage || 'Une erreur est survenue. Veuillez réessayer.'}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="theme-brand-button w-full flex items-center justify-center gap-2 disabled:opacity-50 font-semibold py-3 rounded-xl active:scale-95"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Send size={17} />
                    Envoyer la demande
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
