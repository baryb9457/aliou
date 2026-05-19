import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || '').toString().trim();
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').toString().trim();

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

// Use harmless placeholders in dev so the app can render even if .env is missing.
const fallbackUrl = 'https://placeholder.supabase.co';
const fallbackAnonKey = 'placeholder-anon-key';

export const supabase = createClient(
	supabaseUrl || fallbackUrl,
	supabaseAnonKey || fallbackAnonKey,
);

type SupabaseErrorShape = {
	message?: string;
	code?: string;
	details?: string;
};

export const formatSupabaseError = (error: SupabaseErrorShape | null | undefined) => {
	if (!error) {
		return 'Erreur Supabase inconnue.';
	}

	const message = (error.message || '').toLowerCase();
	const details = (error.details || '').toLowerCase();
	const merged = `${message} ${details}`.trim();

	if (merged.includes('failed to fetch') || merged.includes('network') || merged.includes('fetch')) {
		return 'Connexion impossible au serveur Supabase. Vérifiez VITE_SUPABASE_URL, la clé publique et votre connexion Internet.';
	}

	if (merged.includes('relation') && merged.includes('does not exist')) {
		return 'Tables Supabase introuvables. Exécutez la migration SQL dans Supabase (table contact_requests et devis).';
	}

	if (merged.includes('row-level security') || merged.includes('permission denied')) {
		return 'Accès refusé par les règles de sécurité Supabase (RLS). Vérifiez les policies pour anon/authenticated.';
	}

	if (merged.includes('invalid api key') || merged.includes('apikey') || merged.includes('jwt')) {
		return 'Clé Supabase invalide. Vérifiez VITE_SUPABASE_ANON_KEY (clé publique/anon du bon projet).';
	}

	return `Erreur Supabase: ${error.message || 'inconnue'}`;
};
