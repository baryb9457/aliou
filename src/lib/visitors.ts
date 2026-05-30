import { isSupabaseConfigured, supabase } from './supabase';

const VISITOR_TOKEN_KEY = 'kam-visitor-token';

const createVisitorToken = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

export const getOrCreateVisitorToken = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  const existing = window.localStorage.getItem(VISITOR_TOKEN_KEY);
  if (existing) {
    return existing;
  }

  const token = createVisitorToken();
  window.localStorage.setItem(VISITOR_TOKEN_KEY, token);
  return token;
};

export const trackVisitor = async () => {
  if (!isSupabaseConfigured) {
    return;
  }

  const token = getOrCreateVisitorToken();
  if (!token) {
    return;
  }

  await supabase
    .from('site_visitors')
    .upsert(
      {
        visitor_token: token,
        last_seen_at: new Date().toISOString(),
      },
      {
        onConflict: 'visitor_token',
        ignoreDuplicates: false,
      },
    );
};

export const getTotalVisitors = async () => {
  if (!isSupabaseConfigured) {
    return null;
  }

  const { count, error } = await supabase
    .from('site_visitors')
    .select('*', { count: 'exact', head: true });

  if (error) {
    return null;
  }

  return count ?? 0;
};
