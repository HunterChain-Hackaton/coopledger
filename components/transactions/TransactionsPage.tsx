'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import {
  Plus, Filter, Download, Search, ExternalLink, TrendingUp, TrendingDown, CheckCircle
} from 'lucide-react';
import { RiFileListLine } from 'react-icons/ri';
import { transactionApi } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { Transaction, TxType, TxDirection } from '@/types';
import { Button, Badge, BlockchainStatus, HashDisplay, Modal, EmptyState, SectionHeader, showToast } from '@/components/ui';
import { formatFCFA, formatDate, TX_TYPE_LABELS, TX_TYPE_COLORS, canManage } from '@/lib/utils';
import { useTheme } from '@/hooks/useTheme';

const DEMO_TX: Transaction[] = [
  { id: 1, cooperative: 1, created_by: 1, created_by_name: 'Ama Dossou', tx_type: 'ACHAT_INTRANT', direction: 'OUT', amount_fcfa: 85000, description: 'Achat engrais phosphaté — sac 50kg × 5', blockchain_status: 'CONFIRMED', polygon_tx_hash: '0x1a2b3c4d5e6f7890abcdef1234567890abcdef12', sha256_hash: 'a1b2c3d4e5f67890a1b2c3d4e5f67890a1b2c3d4e5f67890a1b2c3d4e5f67890', transaction_date: '2026-04-30', created_at: '2026-04-30T10:23:00Z' },
  { id: 2, cooperative: 1, created_by: 1, created_by_name: 'Ama Dossou', tx_type: 'COTISATION', direction: 'IN', amount_fcfa: 25000, description: 'Cotisation mensuelle — Kofi Mensah', blockchain_status: 'CONFIRMED', polygon_tx_hash: '0x9876fedcba0987654321fedcba0987654321fedc', transaction_date: '2026-04-29', created_at: '2026-04-29T14:10:00Z' },
  { id: 3, cooperative: 1, created_by: 1, created_by_name: 'Ama Dossou', tx_type: 'PRIME_DISTRIBUTION', direction: 'OUT', amount_fcfa: 120000, description: 'Distribution prime récolte Q1 2026 — 8 membres', blockchain_status: 'PENDING', transaction_date: '2026-04-28', created_at: '2026-04-28T09:00:00Z' },
  { id: 4, cooperative: 1, created_by: 1, created_by_name: 'Ama Dossou', tx_type: 'COTISATION', direction: 'IN', amount_fcfa: 25000, description: 'Cotisation mensuelle — Abla Koffi', blockchain_status: 'CONFIRMED', polygon_tx_hash: '0xabcdef1234567890abcdef1234567890abcdef12', transaction_date: '2026-04-27', created_at: '2026-04-27T11:30:00Z' },
  { id: 5, cooperative: 1, created_by: 1, created_by_name: 'Kofi Agbemadon', tx_type: 'DEPENSE_ADMIN', direction: 'OUT', amount_fcfa: 15000, description: 'Frais de déplacement réunion Kpalimé', blockchain_status: 'CONFIRMED', polygon_tx_hash: '0xfedcba9876543210fedcba9876543210fedcba98', transaction_date: '2026-04-26', created_at: '2026-04-26T16:45:00Z' },
  { id: 6, cooperative: 1, created_by: 1, created_by_name: 'Ama Dossou', tx_type: 'COTISATION', direction: 'IN', amount_fcfa: 25000, description: 'Cotisation mensuelle — Afi Sossou', blockchain_status: 'CONFIRMED', polygon_tx_hash: '0x1111222233334444555566667777888899990000', transaction_date: '2026-04-25', created_at: '2026-04-25T08:15:00Z' },
  { id: 7, cooperative: 1, created_by: 1, created_by_name: 'Ama Dossou', tx_type: 'ACHAT_INTRANT', direction: 'OUT', amount_fcfa: 62000, description: "Achat semences certifiées maïs hybride", blockchain_status: 'CONFIRMED', polygon_tx_hash: '0xaaaa1111bbbb2222cccc3333dddd4444eeee5555', transaction_date: '2026-04-20', created_at: '2026-04-20T10:00:00Z' },
];

// Monthly bar data
const MONTHLY_BAR = [
  { month: 'Jan', in: 420000, out: 185000 },
  { month: 'Fév', in: 380000, out: 220000 },
  { month: 'Mar', in: 510000, out: 290000 },
  { month: 'Avr', in: 460000, out: 175000 },
];

const TX_TYPES: { value: TxType | ''; label: string }[] = [
  { value: '', label: 'Tous les types' },
  { value: 'COTISATION', label: 'Cotisations' },
  { value: 'ACHAT_INTRANT', label: "Achats d'intrants" },
  { value: 'PRIME_DISTRIBUTION', label: 'Primes' },
  { value: 'DEPENSE_ADMIN', label: 'Dépenses admin.' },
  { value: 'AUTRE', label: 'Autre' },
];

// ─── CREATE FORM ───
function CreateTransactionModal({ open, onClose, onCreated }: { open: boolean; onClose: () => void; onCreated: () => void }) {
  const [form, setForm] = useState({
    tx_type: 'COTISATION' as TxType,
    direction: 'IN' as TxDirection,
    amount_fcfa: '',
    description: '',
    transaction_date: new Date().toISOString().slice(0, 10),
  });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (Number(form.amount_fcfa) <= 0) { showToast('Montant invalide', 'error'); return; }
    if (form.description.length < 10) { showToast('Description trop courte (min. 10 caractères)', 'error'); return; }
    setLoading(true);
    try {
      await transactionApi.create({ ...form, amount_fcfa: Number(form.amount_fcfa) });
      showToast('Transaction enregistrée et soumise à la blockchain', 'success');
      onCreated();
      onClose();
    } catch {
      showToast('Erreur lors de l\'enregistrement', 'error');
    } finally {
      setLoading(false);
    }
  }

  const directionColors = { IN: 'var(--success)', OUT: 'var(--danger)' };

  return (
    <Modal open={open} onClose={onClose} title="Nouvelle transaction">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Direction */}
        <div>
          <label className="input-label">Type de mouvement</label>
          <div className="flex gap-3">
            {(['IN', 'OUT'] as TxDirection[]).map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setForm(f => ({ ...f, direction: d }))}
                style={{
                  flex: 1, padding: '10px', borderRadius: 8, border: '1px solid',
                  borderColor: form.direction === d ? directionColors[d] : 'var(--border)',
                  background: form.direction === d ? (d === 'IN' ? 'var(--success-bg)' : 'var(--danger-bg)') : 'var(--bg-input)',
                  color: form.direction === d ? directionColors[d] : 'var(--text-secondary)',
                  cursor: 'pointer', fontWeight: 600, fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                }}
              >
                {d === 'IN' ? <TrendingUp size={15} /> : <TrendingDown size={15} />}
                {d === 'IN' ? 'Entrée' : 'Sortie'}
              </button>
            ))}
          </div>
        </div>

        {/* Type */}
        <div>
          <label className="input-label">Catégorie</label>
          <select className="input" value={form.tx_type} onChange={(e) => setForm(f => ({ ...f, tx_type: e.target.value as TxType }))}>
            {Object.entries(TX_TYPE_LABELS).map(([v, l]) => (
              <option key={v} value={v}>{l}</option>
            ))}
          </select>
        </div>

        {/* Amount */}
        <div>
          <label className="input-label">Montant (FCFA)</label>
          <input
            type="number" className="input" placeholder="Ex: 85000"
            value={form.amount_fcfa}
            onChange={(e) => setForm(f => ({ ...f, amount_fcfa: e.target.value }))}
            min={1} required
          />
        </div>

        {/* Description */}
        <div>
          <label className="input-label">Description (min. 10 caractères)</label>
          <textarea
            className="input" rows={3} placeholder="Décrivez la transaction en détail..."
            value={form.description}
            onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
            style={{ resize: 'vertical' }}
            required
          />
        </div>

        {/* Date */}
        <div>
          <label className="input-label">Date</label>
          <input type="date" className="input" value={form.transaction_date}
            onChange={(e) => setForm(f => ({ ...f, transaction_date: e.target.value }))} required
          />
        </div>

        <div className="flex gap-3 mt-2">
          <Button variant="secondary" type="button" onClick={onClose} style={{ flex: 1 }}>Annuler</Button>
          <Button type="submit" loading={loading} style={{ flex: 1 }}>Enregistrer</Button>
        </div>
      </form>
    </Modal>
  );
}

// ─── DETAIL MODAL ───
function TransactionDetailModal({ tx, open, onClose }: { tx: Transaction | null; open: boolean; onClose: () => void }) {
  if (!tx) return null;
  const polygonscanUrl = tx.polygon_tx_hash ? `https://polygon-amoy.g.alchemy.com/v2/${tx.polygon_tx_hash}` : undefined;
  return (
    <Modal open={open} onClose={onClose} title="Détail transaction">
      <div className="flex flex-col gap-4">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {[
            ['Référence', `TX #${tx.id}`],
            ['Date', formatDate(tx.transaction_date)],
            ['Catégorie', TX_TYPE_LABELS[tx.tx_type]],
            ['Mouvement', tx.direction === 'IN' ? 'Entrée' : 'Sortie'],
          ].map(([k, v]) => (
            <div key={k}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>{k}</div>
              <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)' }}>{v}</div>
            </div>
          ))}
        </div>

        <div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>Montant</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: tx.direction === 'IN' ? 'var(--success)' : 'var(--danger)' }}>
            {tx.direction === 'IN' ? '+' : '-'}{formatFCFA(tx.amount_fcfa)}
          </div>
        </div>

        <div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>Description</div>
          <div style={{ fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.5 }}>{tx.description}</div>
        </div>

        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Preuve Blockchain</div>
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Statut</span>
              <BlockchainStatus status={tx.blockchain_status} />
            </div>
            {tx.polygon_tx_hash && (
              <div className="flex items-center justify-between">
                <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Hash Polygon</span>
                <HashDisplay hash={tx.polygon_tx_hash} url={polygonscanUrl} />
              </div>
            )}
            {tx.sha256_hash && (
              <div className="flex items-center justify-between">
                <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Hash SHA-256</span>
                <HashDisplay hash={tx.sha256_hash} />
              </div>
            )}
            {polygonscanUrl && (
              <a href={polygonscanUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm" style={{ justifyContent: 'center' }}>
                <ExternalLink size={14} /> Voir sur Polygonscan
              </a>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}

// ─── MAIN PAGE ───
export default function TransactionsPage() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [transactions, setTransactions] = useState<Transaction[]>(DEMO_TX);
  const [selected, setSelected] = useState<Transaction | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<TxType | ''>('');
  const [directionFilter, setDirectionFilter] = useState<TxDirection | ''>('');

  const accentColor = theme === 'dry' ? '#f07a2a' : '#059669';

  const canCreate = user?.role ? canManage(user.role) : false;

  const loadTransactions = useCallback(async () => {
    try {
      const { data } = await transactionApi.list();
      setTransactions(data.results || data);
    } catch {
      // keep demo data
    }
  }, []);

  useEffect(() => { loadTransactions(); }, [loadTransactions]);

  const filtered = transactions.filter((tx) => {
    if (typeFilter && tx.tx_type !== typeFilter) return false;
    if (directionFilter && tx.direction !== directionFilter) return false;
    if (search && !tx.description.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const totalIn = filtered.filter(t => t.direction === 'IN').reduce((s, t) => s + t.amount_fcfa, 0);
  const totalOut = filtered.filter(t => t.direction === 'OUT').reduce((s, t) => s + t.amount_fcfa, 0);

  async function handleExport() {
    try {
      const res = await transactionApi.exportCsv();
      const url = URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement('a');
      a.href = url; a.download = 'transactions.csv'; a.click();
    } catch {
      showToast('Export indisponible', 'error');
    }
  }

  return (
    <div>
      <SectionHeader
        title="Transactions"
        description="Historique complet des mouvements financiers, vérifiables sur la blockchain Polygon."
        action={
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" icon={<Download size={15} />} onClick={handleExport}>Export CSV</Button>
            {canCreate && (
              <Button size="sm" icon={<Plus size={15} />} onClick={() => setCreateOpen(true)}>
                Nouvelle transaction
              </Button>
            )}
          </div>
        }
      />

      {/* Mini chart + summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="card p-5 lg:col-span-2">
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 12 }}>Aperçu mensuel (FCFA)</p>
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={MONTHLY_BAR} margin={{ top: 0, right: 0, left: 0, bottom: 0 }} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip formatter={(v: number) => formatFCFA(v)} contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-strong)', borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="in" name="Entrées" fill={accentColor} radius={[4, 4, 0, 0]} />
              <Bar dataKey="out" name="Sorties" fill={theme === 'dry' ? '#7a3c10' : '#047857'} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="flex flex-col gap-4">
          <div className="card p-5">
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Entrées (filtrées)</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--success)' }}>+{formatFCFA(totalIn)}</div>
          </div>
          <div className="card p-5">
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Sorties (filtrées)</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--danger)' }}>-{formatFCFA(totalOut)}</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card mb-4">
        <div className="flex flex-wrap gap-3 p-4">
          <div style={{ position: 'relative', flex: '1 1 200px' }}>
            <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text" className="input" style={{ paddingLeft: 36 }}
              placeholder="Rechercher une transaction..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select className="input" style={{ flex: '0 1 180px' }} value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as TxType | '')}>
            {TX_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
          <select className="input" style={{ flex: '0 1 140px' }} value={directionFilter} onChange={(e) => setDirectionFilter(e.target.value as TxDirection | '')}>
            <option value="">Tous mouvements</option>
            <option value="IN">Entrées</option>
            <option value="OUT">Sorties</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {filtered.length === 0 ? (
          <EmptyState icon={<RiFileListLine />} title="Aucune transaction" description="Ajoutez votre première transaction ou ajustez les filtres." action={canCreate ? <Button size="sm" onClick={() => setCreateOpen(true)}>Nouvelle transaction</Button> : undefined} />
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Catégorie</th>
                  <th>Montant</th>
                  <th>Blockchain</th>
                  <th>Preuve</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((tx) => (
                  <tr key={tx.id} style={{ cursor: 'pointer' }} onClick={() => { setSelected(tx); setDetailOpen(true); }}>
                    <td style={{ fontSize: 13, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>{formatDate(tx.transaction_date)}</td>
                    <td>
                      <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', maxWidth: 240, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {tx.description}
                      </div>
                      {tx.created_by_name && <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>par {tx.created_by_name}</div>}
                    </td>
                    <td>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12,
                        background: `${TX_TYPE_COLORS[tx.tx_type]}18`,
                        color: TX_TYPE_COLORS[tx.tx_type],
                        padding: '3px 8px', borderRadius: 12, fontWeight: 500,
                      }}>
                        {TX_TYPE_LABELS[tx.tx_type]}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontWeight: 700, fontSize: 14, color: tx.direction === 'IN' ? 'var(--success)' : 'var(--danger)' }}>
                        {tx.direction === 'IN' ? '+' : '-'}{formatFCFA(tx.amount_fcfa)}
                      </span>
                    </td>
                    <td><BlockchainStatus status={tx.blockchain_status} /></td>
                    <td><HashDisplay hash={tx.polygon_tx_hash} url={tx.polygon_tx_hash ? `https://polygon-amoy.g.alchemy.com/v2/${tx.polygon_tx_hash}` : undefined} /></td>
                    <td>
                      <Button variant="ghost" size="xs" onClick={(e) => { e.stopPropagation(); setSelected(tx); setDetailOpen(true); }}>
                        Détail
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <CreateTransactionModal open={createOpen} onClose={() => setCreateOpen(false)} onCreated={loadTransactions} />
      <TransactionDetailModal tx={selected} open={detailOpen} onClose={() => setDetailOpen(false)} />
    </div>
  );
}
