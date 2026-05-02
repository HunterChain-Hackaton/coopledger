'use client';

import { useEffect, useState } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, BarChart, Bar
} from 'recharts';
import { TrendingUp, TrendingDown, Clock, CheckCircle2, AlertCircle, Vote, Users, ArrowUpRight } from 'lucide-react';
import { RiShieldCheckLine } from 'react-icons/ri';
import Link from 'next/link';
import { transactionApi, voteApi } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { Transaction, CooperativeVote, TransactionSummary } from '@/types';
import { StatCard, BlockchainStatus, HashDisplay } from '@/components/ui';
import { formatFCFA, formatDate, timeAgo, TX_TYPE_LABELS, TX_TYPE_COLORS, VOTE_STATUS_LABELS } from '@/lib/utils';
import { useTheme } from '@/hooks/useTheme';

// ─── DEMO DATA (used when API unavailable) ───
const DEMO_MONTHLY = [
  { month: 'Jan', in: 420000, out: 185000, balance: 235000 },
  { month: 'Fév', in: 380000, out: 220000, balance: 160000 },
  { month: 'Mar', in: 510000, out: 290000, balance: 220000 },
  { month: 'Avr', in: 460000, out: 175000, balance: 285000 },
  { month: 'Mai', in: 620000, out: 310000, balance: 310000 },
  { month: 'Jun', in: 580000, out: 240000, balance: 340000 },
];

const DEMO_PIE = [
  { name: 'Cotisations', value: 35, color: TX_TYPE_COLORS.COTISATION },
  { name: "Achats d'intrants", value: 30, color: TX_TYPE_COLORS.ACHAT_INTRANT },
  { name: 'Primes', value: 20, color: TX_TYPE_COLORS.PRIME_DISTRIBUTION },
  { name: 'Dépenses admin.', value: 10, color: TX_TYPE_COLORS.DEPENSE_ADMIN },
  { name: 'Autre', value: 5, color: TX_TYPE_COLORS.AUTRE },
];

const DEMO_TRANSACTIONS: Transaction[] = [
  { id: 1, cooperative: 1, created_by: 1, created_by_name: 'Ama Dossou', tx_type: 'ACHAT_INTRANT', direction: 'OUT', amount_fcfa: 85000, description: 'Achat engrais phosphaté', blockchain_status: 'CONFIRMED', polygon_tx_hash: '0x1a2b3c4d5e6f7890abcdef1234567890abcdef12', transaction_date: '2026-04-30', created_at: '2026-04-30T10:23:00Z' },
  { id: 2, cooperative: 1, created_by: 1, tx_type: 'COTISATION', direction: 'IN', amount_fcfa: 25000, description: 'Cotisation mensuelle — Kofi Mensah', blockchain_status: 'CONFIRMED', polygon_tx_hash: '0x9876fedcba0987654321fedcba0987654321fedc', transaction_date: '2026-04-29', created_at: '2026-04-29T14:10:00Z' },
  { id: 3, cooperative: 1, created_by: 1, tx_type: 'PRIME_DISTRIBUTION', direction: 'OUT', amount_fcfa: 120000, description: 'Distribution prime récolte Q1 2026', blockchain_status: 'PENDING', transaction_date: '2026-04-28', created_at: '2026-04-28T09:00:00Z' },
  { id: 4, cooperative: 1, created_by: 1, tx_type: 'COTISATION', direction: 'IN', amount_fcfa: 25000, description: 'Cotisation mensuelle — Abla Koffi', blockchain_status: 'CONFIRMED', polygon_tx_hash: '0xabcdef1234567890abcdef1234567890abcdef12', transaction_date: '2026-04-27', created_at: '2026-04-27T11:30:00Z' },
  { id: 5, cooperative: 1, created_by: 1, tx_type: 'DEPENSE_ADMIN', direction: 'OUT', amount_fcfa: 15000, description: 'Frais de déplacement réunion Kpalimé', blockchain_status: 'CONFIRMED', polygon_tx_hash: '0xfedcba9876543210fedcba9876543210fedcba98', transaction_date: '2026-04-26', created_at: '2026-04-26T16:45:00Z' },
];

const DEMO_VOTES: CooperativeVote[] = [
  { id: 1, cooperative: 1, created_by: 1, title: 'Achat tracteur collectif', description: 'Proposition d\'acquisition d\'un tracteur agricole collectif pour la récolte 2026.', description_hash: 'abc123', threshold_amount_fcfa: 2500000, deadline: '2026-05-10T23:59:00Z', quorum_required: 7, status: 'OPEN', votes_for: 4, votes_against: 1, quorum_reached: false, passed: false, created_at: '2026-04-28T08:00:00Z', total_votes: 5 },
  { id: 2, cooperative: 1, created_by: 1, title: 'Renouvellement contrat semences', description: 'Reconduction du partenariat avec le fournisseur de semences certifiées.', description_hash: 'def456', threshold_amount_fcfa: 350000, deadline: '2026-04-20T23:59:00Z', quorum_required: 7, status: 'CLOSED', votes_for: 8, votes_against: 2, quorum_reached: true, passed: true, created_at: '2026-04-10T08:00:00Z', closed_at: '2026-04-20T23:59:00Z', total_votes: 10 },
];

// ─── TOOLTIP ───
function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number; name: string; color: string }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-strong)', borderRadius: 8, padding: '10px 14px', fontSize: 13 }}>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 6, fontWeight: 600 }}>{label}</p>
      {payload.map((p, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
          <span style={{ width: 8, height: 8, borderRadius: 2, background: p.color, display: 'inline-block' }} />
          <span style={{ color: 'var(--text-secondary)' }}>{p.name}:</span>
          <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{formatFCFA(p.value)}</span>
        </div>
      ))}
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [summary, setSummary] = useState<TransactionSummary | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>(DEMO_TRANSACTIONS);
  const [votes, setVotes] = useState<CooperativeVote[]>(DEMO_VOTES);
  const [loading, setLoading] = useState(false);

  const accentColor = theme === 'dry' ? '#f07a2a' : '#059669';
  const isDry = theme === 'dry';

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const [txRes, voteRes, sumRes] = await Promise.allSettled([
          transactionApi.list({ limit: 5 }),
          voteApi.list({ limit: 4 }),
          transactionApi.summary(),
        ]);
        if (txRes.status === 'fulfilled') setTransactions(txRes.value.data.results || txRes.value.data);
        if (voteRes.status === 'fulfilled') setVotes(voteRes.value.data.results || voteRes.value.data);
        if (sumRes.status === 'fulfilled') setSummary(sumRes.value.data);
      } catch {
        // Use demo data
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const monthlyData = summary?.monthly || DEMO_MONTHLY;
  const balance = summary?.balance ?? 1285000;
  const totalIn = summary?.total_in ?? 620000;
  const totalOut = summary?.total_out ?? 310000;

  const pieData = DEMO_PIE; // Would come from summary.by_type

  const openVotes = votes.filter(v => v.status === 'OPEN');

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'Sora, sans-serif', marginBottom: 4 }}>
            Bonjour, {user?.full_name?.split(' ')[0]}
          </h1>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
            {user?.cooperative_name || 'Coopérative Agricole de Kpalimé'} · Tableau de bord
          </p>
        </div>
        <div className="flex items-center gap-2">
          <RiShieldCheckLine size={16} style={{ color: 'var(--success)' }} />
          <span style={{ fontSize: 12, color: 'var(--success)' }}>Réseau Polygon actif</span>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Solde actuel"
          value={formatFCFA(balance)}
          delta="+12% ce mois"
          deltaUp
          icon={<TrendingUp size={18} />}
          accent
        />
        <StatCard
          label="Entrées (30j)"
          value={formatFCFA(totalIn)}
          delta="+8% vs mois dernier"
          deltaUp
          icon={<ArrowUpRight size={18} />}
        />
        <StatCard
          label="Sorties (30j)"
          value={formatFCFA(totalOut)}
          delta="-3% vs mois dernier"
          deltaUp
          icon={<TrendingDown size={18} />}
        />
        <StatCard
          label="Votes en cours"
          value={String(openVotes.length)}
          delta={`${votes.length} total ce mois`}
          deltaUp
          icon={<Vote size={18} />}
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Balance evolution — spans 2 cols */}
        <div className="card p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>Évolution du solde</h2>
              <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Entrées et sorties sur 6 mois</p>
            </div>
            <div className="flex items-center gap-4" style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
              <span className="flex items-center gap-1"><span style={{ width: 10, height: 10, borderRadius: 2, background: accentColor, display: 'inline-block' }} />Entrées</span>
              <span className="flex items-center gap-1"><span style={{ width: 10, height: 10, borderRadius: 2, background: isDry ? '#7a3c10' : '#a7f3d0', display: 'inline-block' }} />Sorties</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={monthlyData} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="gradIn" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={accentColor} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={accentColor} stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="gradOut" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={isDry ? '#7a3c10' : '#059669'} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={isDry ? '#7a3c10' : '#059669'} stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
              <XAxis dataKey="month" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="in" name="Entrées" stroke={accentColor} strokeWidth={2} fill="url(#gradIn)" dot={false} activeDot={{ r: 5, fill: accentColor }} />
              <Area type="monotone" dataKey="out" name="Sorties" stroke={isDry ? '#7a3c10' : '#047857'} strokeWidth={2} fill="url(#gradOut)" dot={false} activeDot={{ r: 5, fill: isDry ? '#7a3c10' : '#047857' }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Pie chart */}
        <div className="card p-6">
          <h2 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>Répartition dépenses</h2>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16 }}>30 derniers jours</p>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="value" paddingAngle={3}>
                {pieData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} strokeWidth={0} />
                ))}
              </Pie>
              <Tooltip formatter={(v: number) => `${v}%`} contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-strong)', borderRadius: 8, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-col gap-2 mt-2">
            {pieData.map((d, i) => (
              <div key={i} className="flex items-center justify-between" style={{ fontSize: 12 }}>
                <div className="flex items-center gap-2">
                  <span style={{ width: 8, height: 8, borderRadius: 2, background: d.color, display: 'inline-block', flexShrink: 0 }} />
                  <span style={{ color: 'var(--text-secondary)' }}>{d.name}</span>
                </div>
                <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{d.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom row: Recent transactions + Active votes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent transactions */}
        <div className="card">
          <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
            <h2 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>Transactions récentes</h2>
            <Link href="/dashboard/transactions" style={{ fontSize: 13, color: 'var(--accent)', textDecoration: 'none', fontWeight: 500 }}>
              Voir tout →
            </Link>
          </div>
          <div>
            {transactions.slice(0, 5).map((tx) => (
              <div key={tx.id} className="flex items-center gap-3 px-6 py-4" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  background: tx.direction === 'IN' ? 'var(--success-bg)' : 'var(--danger-bg)',
                }}>
                  {tx.direction === 'IN'
                    ? <TrendingUp size={16} style={{ color: 'var(--success)' }} />
                    : <TrendingDown size={16} style={{ color: 'var(--danger)' }} />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {tx.description}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                    {TX_TYPE_LABELS[tx.tx_type]} · {timeAgo(tx.created_at)}
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: tx.direction === 'IN' ? 'var(--success)' : 'var(--danger)' }}>
                    {tx.direction === 'IN' ? '+' : '-'}{formatFCFA(tx.amount_fcfa)}
                  </div>
                  <BlockchainStatus status={tx.blockchain_status} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Votes */}
        <div className="card">
          <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
            <h2 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>Votes</h2>
            <Link href="/dashboard/votes" style={{ fontSize: 13, color: 'var(--accent)', textDecoration: 'none', fontWeight: 500 }}>
              Voir tout →
            </Link>
          </div>
          <div>
            {votes.map((vote) => {
              const total = vote.votes_for + vote.votes_against;
              const forPct = total > 0 ? Math.round((vote.votes_for / total) * 100) : 0;
              return (
                <div key={vote.id} className="px-6 py-4" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <div className="flex items-start justify-between mb-2 gap-2">
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {vote.title}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                        Seuil : {formatFCFA(vote.threshold_amount_fcfa)}
                      </div>
                    </div>
                    <span className={`badge ${vote.status === 'OPEN' ? 'badge-accent' : vote.passed ? 'badge-success' : 'badge-muted'}`} style={{ fontSize: 11, flexShrink: 0 }}>
                      {vote.status === 'OPEN' ? 'En cours' : vote.passed ? 'Adopté' : 'Rejeté'}
                    </span>
                  </div>
                  {/* Progress bar */}
                  <div className="flex items-center gap-2 mt-2">
                    <span style={{ fontSize: 11, color: 'var(--success)', fontWeight: 600, minWidth: 30 }}>{vote.votes_for} ✓</span>
                    <div style={{ flex: 1, height: 6, background: 'var(--border-subtle)', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ width: `${forPct}%`, height: '100%', background: 'var(--success)', borderRadius: 3, transition: 'width 0.5s ease' }} />
                    </div>
                    <span style={{ fontSize: 11, color: 'var(--danger)', fontWeight: 600, minWidth: 30, textAlign: 'right' }}>{vote.votes_against} ✗</span>
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
                    {total} vote(s) · quorum : {vote.quorum_required}
                    {vote.status === 'OPEN' && ` · deadline ${formatDate(vote.deadline)}`}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
