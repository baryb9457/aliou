import { useState, useEffect, useCallback } from 'react';
import {
  LogOut, RefreshCw, Inbox, FileText, Clock,
  CheckCircle, ChevronRight, Plus, Eye, Trash2, Download,
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { ContactRequest, Devis, RequestStatus } from '../../types';
import DevisModal from './DevisModal';
import ThemeToggle from '../layout/ThemeToggle';
import KamLogo from '../layout/KamLogo';
import { downloadDevisPdf } from '../../lib/devisPdf';

interface AdminDashboardProps {
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
  onLogout: () => void;
}

const statusConfig: Record<RequestStatus, { label: string; color: string; bg: string }> = {
  pending: { label: 'En attente', color: 'text-amber-400', bg: 'bg-amber-400/10 border-amber-400/20' },
  in_progress: { label: 'En cours', color: 'text-teal-400', bg: 'bg-teal-400/10 border-teal-400/20' },
  quoted: { label: 'Devis envoyé', color: 'text-cyan-400', bg: 'bg-cyan-400/10 border-cyan-400/20' },
  completed: { label: 'Terminé', color: 'text-green-400', bg: 'bg-green-400/10 border-green-400/20' },
};

const devisStatusConfig: Record<Devis['status'], { label: string; color: string }> = {
  draft: { label: 'Brouillon', color: 'text-slate-400' },
  sent: { label: 'Envoyé', color: 'text-teal-400' },
  accepted: { label: 'Accepté', color: 'text-green-400' },
  rejected: { label: 'Refusé', color: 'text-red-400' },
};

const serviceLabels: Record<string, string> = {
  web: 'Développement Web',
  it: 'Support IT',
  admin: 'Gestion Admin',
  other: 'Autre',
};

type Tab = 'requests' | 'devis';

export default function AdminDashboard({ theme, onThemeToggle, onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<Tab>('requests');
  const [requests, setRequests] = useState<ContactRequest[]>([]);
  const [devisList, setDevisList] = useState<Devis[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<ContactRequest | null>(null);
  const [selectedDevis, setSelectedDevis] = useState<Devis | null>(null);
  const [showDevisModal, setShowDevisModal] = useState(false);
  const [devisForRequest, setDevisForRequest] = useState<ContactRequest | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);

    const [reqRes, devRes] = await Promise.all([
      supabase.from('contact_requests').select('*').order('created_at', { ascending: false }),
      supabase.from('devis').select('*').order('created_at', { ascending: false }),
    ]);

    if (reqRes.data) {
      setRequests(reqRes.data as ContactRequest[]);
    }
    if (devRes.data) {
      setDevisList(devRes.data as Devis[]);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    onLogout();
  };

  const updateRequestStatus = async (id: string, status: RequestStatus) => {
    await supabase.from('contact_requests').update({ status }).eq('id', id);
    setRequests((prev) => prev.map((request) => (request.id === id ? { ...request, status } : request)));
  };

  const deleteRequest = async (id: string) => {
    if (!confirm('Supprimer cette demande ?')) return;

    await supabase.from('contact_requests').delete().eq('id', id);
    setRequests((prev) => prev.filter((request) => request.id !== id));

    if (selectedRequest?.id === id) {
      setSelectedRequest(null);
    }
  };

  const deleteDevis = async (id: string) => {
    if (!confirm('Supprimer ce devis ?')) return;

    await supabase.from('devis').delete().eq('id', id);
    setDevisList((prev) => prev.filter((devis) => devis.id !== id));
  };

  const stats = {
    pending: requests.filter((request) => request.status === 'pending').length,
    total: requests.length,
    quoted: devisList.length,
    accepted: devisList.filter((devis) => devis.status === 'accepted').length,
  };

  return (
    <div className="theme-shell min-h-screen flex flex-col">
      <header className="theme-section-alt border-b theme-divider px-6 py-3.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <KamLogo size="sm" textClassName="theme-text" />
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle theme={theme} onToggle={onThemeToggle} />
          <button
            onClick={fetchData}
            className="theme-text-muted hover:text-[var(--text-primary)] transition-colors p-1.5 rounded-lg hover:bg-[var(--button-ghost)]"
          >
            <RefreshCw size={15} />
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 theme-text-soft hover:text-[var(--text-primary)] text-sm transition-colors px-3 py-1.5 rounded-lg hover:bg-[var(--button-ghost)]"
          >
            <LogOut size={15} /> Déconnexion
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto w-full px-6 py-8 flex-1">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Clock, label: 'En attente', value: stats.pending, color: 'text-amber-400' },
            { icon: Inbox, label: 'Total demandes', value: stats.total, color: 'text-teal-400' },
            { icon: FileText, label: 'Devis créés', value: stats.quoted, color: 'text-cyan-400' },
            { icon: CheckCircle, label: 'Devis acceptés', value: stats.accepted, color: 'text-green-400' },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="theme-card rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <Icon size={16} className={color} />
                <span className={`text-2xl font-extrabold ${color}`}>{value}</span>
              </div>
              <p className="theme-text-muted text-xs">{label}</p>
            </div>
          ))}
        </div>

        <div className="flex border-b theme-divider mb-6 gap-1">
          {([
            { key: 'requests', label: 'Demandes clients', icon: Inbox },
            { key: 'devis', label: 'Devis', icon: FileText },
          ] as const).map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-all ${
                activeTab === key
                  ? 'border-teal-500 text-teal-500'
                  : 'border-transparent theme-text-muted hover:text-[var(--text-primary)]'
              }`}
            >
              <Icon size={15} /> {label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-slate-400/30 border-t-teal-500 rounded-full animate-spin" />
          </div>
        ) : activeTab === 'requests' ? (
          <div className={`grid gap-6 ${selectedRequest ? 'md:grid-cols-2' : ''}`}>
            <div className="space-y-3">
              {requests.length === 0 ? (
                <div className="text-center py-16 theme-text-muted">
                  <Inbox size={40} className="mx-auto mb-3 opacity-40" />
                  <p>Aucune demande pour le moment.</p>
                </div>
              ) : (
                requests.map((request) => {
                  const status = statusConfig[request.status];

                  return (
                    <div
                      key={request.id}
                      className={`theme-card rounded-xl p-4 cursor-pointer ${
                        selectedRequest?.id === request.id ? 'border-teal-500' : ''
                      }`}
                      onClick={() => setSelectedRequest(selectedRequest?.id === request.id ? null : request)}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="theme-text font-semibold text-sm truncate">{request.name}</p>
                            <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${status.bg} ${status.color}`}>
                              {status.label}
                            </span>
                          </div>
                          <p className="theme-text-soft text-xs mt-0.5 truncate">{request.email}</p>
                          <p className="theme-text-muted text-xs mt-1">
                            {serviceLabels[request.service_type]} &middot; {new Date(request.created_at).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                        <ChevronRight
                          size={16}
                          className={`theme-text-muted transition-transform mt-0.5 shrink-0 ${selectedRequest?.id === request.id ? 'rotate-90' : ''}`}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {selectedRequest && (
              <div className="theme-card rounded-xl p-6 space-y-4 h-fit sticky top-6">
                <div className="flex items-center justify-between">
                  <h3 className="theme-text font-bold">Détail de la demande</h3>
                  <button onClick={() => setSelectedRequest(null)} className="theme-text-muted hover:text-[var(--text-primary)]">
                    <X size={18} />
                  </button>
                </div>

                <div className="space-y-3 text-sm">
                  {[
                    { label: 'Nom', value: selectedRequest.name },
                    { label: 'Email', value: selectedRequest.email },
                    { label: 'Téléphone', value: selectedRequest.phone || '—' },
                    { label: 'Service', value: serviceLabels[selectedRequest.service_type] },
                    {
                      label: 'Date',
                      value: new Date(selectedRequest.created_at).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                      }),
                    },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between gap-4">
                      <span className="theme-text-muted">{label}</span>
                      <span className="theme-text text-right">{value}</span>
                    </div>
                  ))}
                </div>

                <div>
                  <p className="theme-text-muted text-xs font-semibold uppercase tracking-wider mb-2">Message</p>
                  <p className="theme-panel theme-text-soft text-sm leading-relaxed rounded-xl p-3">{selectedRequest.message}</p>
                </div>

                <div>
                  <p className="theme-text-muted text-xs font-semibold uppercase tracking-wider mb-2">Changer le statut</p>
                  <select
                    value={selectedRequest.status}
                    onChange={(e) => {
                      const nextStatus = e.target.value as RequestStatus;
                      updateRequestStatus(selectedRequest.id, nextStatus);
                      setSelectedRequest({ ...selectedRequest, status: nextStatus });
                    }}
                    className="theme-input w-full rounded-xl px-3 py-2.5 text-sm"
                  >
                    {Object.entries(statusConfig).map(([key, { label }]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => {
                      setDevisForRequest(selectedRequest);
                      setSelectedDevis(null);
                      setShowDevisModal(true);
                    }}
                    className="theme-brand-button flex-1 flex items-center justify-center gap-1.5 font-semibold py-2.5 rounded-xl text-sm"
                  >
                    <FileText size={15} /> Créer un devis
                  </button>
                  <button
                    onClick={() => deleteRequest(selectedRequest.id)}
                    className="theme-panel px-3 py-2.5 theme-text-muted hover:bg-red-500/20 hover:text-red-400 rounded-xl hover:border-red-500/30 transition-all"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div>
            <div className="flex justify-end mb-4">
              <button
                onClick={() => {
                  setDevisForRequest(null);
                  setSelectedDevis(null);
                  setShowDevisModal(true);
                }}
                className="theme-brand-button flex items-center gap-2 font-semibold px-4 py-2.5 rounded-xl text-sm"
              >
                <Plus size={15} /> Nouveau devis
              </button>
            </div>

            {devisList.length === 0 ? (
              <div className="text-center py-16 theme-text-muted">
                <FileText size={40} className="mx-auto mb-3 opacity-40" />
                <p>Aucun devis créé pour le moment.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {devisList.map((devis) => {
                  const devisStatus = devisStatusConfig[devis.status];

                  return (
                    <div key={devis.id} className="theme-card rounded-xl p-4 flex items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="theme-text font-semibold text-sm">{devis.client_name}</p>
                          <span className={`text-xs font-medium ${devisStatus.color}`}>{devisStatus.label}</span>
                        </div>
                        <p className="theme-text-soft text-xs mt-0.5">{devis.client_email}</p>
                        <p className="theme-text-muted text-xs mt-1">
                          {devis.total_amount.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })} &middot; {new Date(devis.created_at).toLocaleDateString('fr-FR')}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            downloadDevisPdf({
                              id: devis.id,
                              clientName: devis.client_name,
                              clientEmail: devis.client_email,
                              items: devis.items,
                              totalAmount: devis.total_amount,
                              notes: devis.notes,
                              status: devis.status,
                              createdAt: devis.created_at,
                            })
                          }
                          className="flex items-center gap-1.5 theme-text-muted hover:text-teal-500 text-xs border theme-divider hover:border-teal-500/40 px-3 py-1.5 rounded-lg transition-all"
                        >
                          <Download size={13} /> PDF
                        </button>
                        <button
                          onClick={() => {
                            setSelectedDevis(devis);
                            setDevisForRequest(null);
                            setShowDevisModal(true);
                          }}
                          className="flex items-center gap-1.5 theme-text-muted hover:text-teal-500 text-xs border theme-divider hover:border-teal-500/40 px-3 py-1.5 rounded-lg transition-all"
                        >
                          <Eye size={13} /> Voir
                        </button>
                        <button
                          onClick={() => deleteDevis(devis.id)}
                          className="theme-text-muted hover:text-red-400 transition-colors p-1.5"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {showDevisModal && (
        <DevisModal
          request={devisForRequest}
          existingDevis={selectedDevis}
          onClose={() => setShowDevisModal(false)}
          onSaved={() => {
            setShowDevisModal(false);
            fetchData();
          }}
        />
      )}
    </div>
  );
}

function X({ size, className }: { size: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}
