import { useState, useEffect } from 'react';
import { X, Plus, Trash2, FileText, Save, Download } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { ContactRequest, DevisItem, Devis } from '../../types';
import { defaultDevisNotes } from '../../lib/business';
import { downloadDevisPdf } from '../../lib/devisPdf';
import { sendDevisNotification } from '../../lib/email';

interface DevisModalProps {
  request: ContactRequest | null;
  existingDevis?: Devis | null;
  onClose: () => void;
  onSaved: () => void;
}

const emptyItem = (): DevisItem => ({ description: '', quantity: 1, unit_price: 0 });

export default function DevisModal({ request, existingDevis, onClose, onSaved }: DevisModalProps) {
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [items, setItems] = useState<DevisItem[]>([emptyItem()]);
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<Devis['status']>('draft');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (existingDevis) {
      setClientName(existingDevis.client_name);
      setClientEmail(existingDevis.client_email);
      setItems(existingDevis.items.length ? existingDevis.items : [emptyItem()]);
      setNotes(existingDevis.notes);
      setStatus(existingDevis.status);
    } else if (request) {
      setClientName(request.name);
      setClientEmail(request.email);
      setNotes(defaultDevisNotes);
    } else {
      setNotes(defaultDevisNotes);
    }
  }, [existingDevis, request]);

  const total = items.reduce((acc, item) => acc + item.quantity * item.unit_price, 0);

  const updateItem = (index: number, field: keyof DevisItem, value: string | number) => {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const addItem = () => setItems((prev) => [...prev, emptyItem()]);
  const removeItem = (index: number) => setItems((prev) => prev.filter((_, i) => i !== index));

  const handleSave = async () => {
    setSaving(true);
    try {
      const nowIso = new Date().toISOString();
      const payload = {
        client_name: clientName,
        client_email: clientEmail,
        items,
        total_amount: total,
        notes,
        status,
        request_id: request?.id ?? null,
        updated_at: nowIso,
      };

      let error: { message: string } | null = null;
      let devisId = existingDevis?.id;

      if (existingDevis) {
        ({ error } = await supabase.from('devis').update(payload).eq('id', existingDevis.id));
      } else {
        const { data, error: insertError } = await supabase.from('devis').insert([payload]).select();
        error = insertError;
        devisId = data?.[0]?.id;

        if (!error && request) {
          await supabase.from('contact_requests').update({ status: 'quoted' }).eq('id', request.id);
        }
      }

      if (error) {
        alert(`Impossible d'enregistrer le devis: ${error.message}`);
        return;
      }

      if (!existingDevis) {
        const reference = `DEV-${nowIso.slice(0, 10).replace(/-/g, '')}-${devisId?.slice(0, 6).toUpperCase() ?? 'NEW'}`;
        try {
          await sendDevisNotification({
            clientName,
            clientEmail,
            items,
            totalAmount: total,
            notes,
            status,
            createdAt: nowIso,
            reference,
          });
        } catch (notificationError) {
          console.error('Devis notification failed:', notificationError);
        }
      }

      onSaved();
    } finally {
      setSaving(false);
    }
  };

  const handleDownload = () => {
    downloadDevisPdf({
      id: existingDevis?.id,
      clientName,
      clientEmail,
      items,
      totalAmount: total,
      notes,
      status,
      createdAt: existingDevis?.created_at ?? new Date().toISOString(),
    });
  };

  return (
    <div className="theme-overlay fixed inset-0 z-50 flex items-start justify-center backdrop-blur-sm px-4 py-6 overflow-y-auto">
      <div className="theme-card w-full max-w-2xl rounded-2xl shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b theme-divider">
          <div className="flex items-center gap-2">
            <FileText size={18} className="theme-brand" />
            <h2 className="theme-text font-bold">
              {existingDevis ? 'Modifier le devis' : 'Créer un devis'}
            </h2>
          </div>
          <button onClick={onClose} className="theme-text-muted hover:text-[var(--text-primary)] transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block theme-text-muted text-xs font-semibold uppercase tracking-wider mb-1.5">Client *</label>
              <input
                type="text"
                required
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="theme-input w-full rounded-xl px-4 py-2.5 text-sm"
                placeholder="Nom du client"
              />
            </div>
            <div>
              <label className="block theme-text-muted text-xs font-semibold uppercase tracking-wider mb-1.5">Email *</label>
              <input
                type="email"
                required
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                className="theme-input w-full rounded-xl px-4 py-2.5 text-sm"
                placeholder="email@client.fr"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="theme-text-muted text-xs font-semibold uppercase tracking-wider">Lignes du devis</label>
              <button
                onClick={addItem}
                className="flex items-center gap-1.5 theme-link text-xs font-medium"
              >
                <Plus size={14} /> Ajouter une ligne
              </button>
            </div>

            <div className="space-y-2">
              <div className="grid grid-cols-12 gap-2 theme-text-muted text-xs uppercase tracking-wider px-1">
                <span className="col-span-6">Description</span>
                <span className="col-span-2 text-center">Qté</span>
                <span className="col-span-3 text-right">Prix unit. (€)</span>
                <span className="col-span-1" />
              </div>
              {items.map((item, i) => (
                <div key={i} className="grid grid-cols-12 gap-2 items-center">
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => updateItem(i, 'description', e.target.value)}
                    className="theme-input col-span-6 rounded-lg px-3 py-2 text-sm"
                    placeholder="Description de la prestation"
                  />
                  <input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) => updateItem(i, 'quantity', parseFloat(e.target.value) || 1)}
                    className="theme-input col-span-2 text-center rounded-lg px-2 py-2 text-sm"
                  />
                  <input
                    type="number"
                    min={0}
                    step={0.01}
                    value={item.unit_price}
                    onChange={(e) => updateItem(i, 'unit_price', parseFloat(e.target.value) || 0)}
                    className="theme-input col-span-3 text-right rounded-lg px-3 py-2 text-sm"
                  />
                  <button
                    onClick={() => removeItem(i)}
                    disabled={items.length === 1}
                    className="col-span-1 flex justify-center text-slate-600 hover:text-red-400 disabled:opacity-30 transition-colors"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <div className="theme-panel rounded-xl px-5 py-3 text-right">
              <p className="theme-text-muted text-xs mb-0.5">Total HT</p>
              <p className="theme-text font-extrabold text-2xl">
                {total.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
              </p>
            </div>
          </div>

          <div>
            <label className="block theme-text-muted text-xs font-semibold uppercase tracking-wider mb-1.5">Notes / Conditions</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="theme-input w-full rounded-xl px-4 py-2.5 text-sm resize-none"
              placeholder="Conditions de paiement, délais, remarques..."
            />
          </div>

          <div>
            <label className="block theme-text-muted text-xs font-semibold uppercase tracking-wider mb-1.5">Statut</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as Devis['status'])}
              className="theme-input w-full rounded-xl px-4 py-2.5 text-sm"
            >
              <option value="draft">Brouillon</option>
              <option value="sent">Envoyé</option>
              <option value="accepted">Accepté</option>
              <option value="rejected">Refusé</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t theme-divider">
          <button
            onClick={handleDownload}
            disabled={!clientName || !clientEmail || items.length === 0}
            className="theme-ghost-button flex items-center gap-2 disabled:opacity-50 px-5 py-2.5 rounded-xl text-sm font-medium"
          >
            <Download size={16} /> Telecharger
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2.5 theme-text-muted hover:text-[var(--text-primary)] text-sm font-medium transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !clientName || !clientEmail}
            className="theme-brand-button flex items-center gap-2 disabled:opacity-50 font-semibold px-6 py-2.5 rounded-xl text-sm active:scale-95"
          >
            {saving ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Save size={16} />
            )}
            {existingDevis ? 'Mettre à jour' : 'Créer le devis'}
          </button>
        </div>
      </div>
    </div>
  );
}
