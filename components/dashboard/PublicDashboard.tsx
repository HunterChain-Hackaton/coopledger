'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { RiLeafLine, RiSunLine, RiShieldCheckLine, RiExternalLinkLine } from 'react-icons/ri';
import { Users, Vote, TrendingUp, CheckCircle2, ExternalLink, ArrowRight } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { formatFCFA, formatDate, TX_TYPE_LABELS, TX_TYPE_COLORS } from '@/lib/utils';
import { BlockchainStatus, HashDisplay } from '@/components/ui';

// Demo public data
const PUBLIC_TRANSACTIONS = [
  { id: 1, tx_type: 'ACHAT_INTRANT', direction: 'OUT', amount_fcfa: 85000, description: 'Achat engrais phosphaté', blockchain_status: 'CONFIRMED', polygon_tx_hash: '0x1a2b3c4d5e6f7890abcdef1234567890abcdef12', transaction_date: '2026-04-30' },
  { id: 2, tx_type: 'COTISATION', direction: 'IN', amount_fcfa: 25000, description: 'Cotisation mensuelle', blockchain_status: 'CONFIRMED', polygon_tx_hash: '0x9876fedcba0987654321fedcba0987654321fedc', transaction_date: '2026-04-29' },
  { id: 3, tx_type: 'COTISATION', direction: 'IN', amount_fcfa: 25000, description: 'Cotisation mensuelle', blockchain_status: 'CONFIRMED', polygon_tx_hash: '0xabcdef1234567890abcdef1234567890abcdef12', transaction_date: '2026-04-28' },
  { id: 4, tx_type: 'PRIME_DISTRIBUTION', direction: 'OUT', amount_fcfa: 120000, description: 'Distribution prime récolte Q1', blockchain_status: 'PENDING', transaction_date: '2026-04-27' },
  { id: 5, tx_type: 'DEPENSE_ADMIN', direction: 'OUT', amount_fcfa: 15000, description: 'Frais déplacement réunion', blockchain_status: 'CONFIRMED', polygon_tx_hash: '0xfedcba9876543210fedcba9876543210fedcba98', transaction_date: '2026-04-26' },
];

const MONTHLY = [
  { month: 'Jan', balance: 850000 },
  { month: 'Fév', balance: 980000 },
  { month: 'Mar', balance: 1100000 },
  { month: 'Avr', balance: 1020000 },
  { month: 'Mai', balance: 1285000 },
];

const PIE_DATA = [
  { name: 'Cotisations', value: 35, color: TX_TYPE_COLORS.COTISATION },
  { name: "Intrants", value: 30, color: TX_TYPE_COLORS.ACHAT_INTRANT },
  { name: 'Primes', value: 20, color: TX_TYPE_COLORS.PRIME_DISTRIBUTION },
  { name: 'Admin.', value: 15, color: TX_TYPE_COLORS.DEPENSE_ADMIN },
];

const PUBLIC_VOTES = [
  { id: 1, title: 'Achat tracteur collectif', status: 'OPEN', votes_for: 4, votes_against: 1, quorum_required: 7, deadline: '2026-05-10T23:59:00Z' },
  { id: 2, title: 'Renouvellement contrat semences', status: 'CLOSED', passed: true, votes_for: 8, votes_against: 2, quorum_required: 7 },
];

export default function PublicDashboard() {
  const { theme, toggle } = useTheme();
  const isDry = theme === 'dry';
  const accentColor = isDry ? '#f07a2a' : '#059669';

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Header */}
      <header style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-secondary)', position: 'sticky', top: 0, zIndex: 20 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div className="flex items-center gap-3">
            <div style={{ width: 34, height: 34, borderRadius: 9, background: accentColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {isDry ? <RiSunLine size={18} color="white" /> : <RiLeafLine size={18} color="white" />}
            </div>
            <div>
              <span style={{ fontWeight: 700, fontSize: 16, color: 'var(--text-primary)' }}>CoopLedger</span>
              <span style={{ fontSize: 12, color: 'var(--text-muted)', marginLeft: 8 }}>Tableau public · CAK Kpalimé</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2" style={{ fontSize: 12, color: 'var(--success)' }}>
              <RiShieldCheckLine size={14} />
              <span className="hidden sm:inline">Polygon Amoy · Actif</span>
            </div>
            <button onClick={toggle} style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 20, padding: '5px 12px', cursor: 'pointer', color: 'var(--text-secondary)', fontSize: 12, display: 'flex', alignItems: 'center', gap: 5 }}>
              {isDry ? <RiSunLine size={13} /> : <RiLeafLine size={13} />}
              <span className="hidden sm:inline">{isDry ? 'Saison sèche' : 'Pluies'}</span>
            </button>
            <Link href="/login" className="btn btn-primary btn-sm" style={{ textDecoration: 'none' }}>
              Connexion <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>
        {/* Hero */}
        <div className="animate-fadeIn" style={{ marginBottom: 32, padding: '28px 32px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', borderLeft: `4px solid ${accentColor}` }}>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 30, color: 'var(--text-primary)', marginBottom: 8 }}>
                Coopérative Agricole de Kpalimé
              </h1>
              <p style={{ fontSize: 15, color: 'var(--text-secondary)', maxWidth: 540, lineHeight: 1.6 }}>
                Données financières publiques et vérifiables. Chaque transaction est ancrée sur la blockchain Polygon — transparence totale, sans intermédiaire.
              </p>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>SOLDE EN TEMPS RÉEL</div>
              <div style={{ fontSize: 36, fontWeight: 800, color: accentColor, fontFamily: 'Sora, sans-serif' }}>{formatFCFA(1285000)}</div>
              <div style={{ fontSize: 12, color: 'var(--success)', display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end', marginTop: 4 }}>
                <TrendingUp size={12} /> +12% ce mois
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Transactions confirmées', value: '34', icon: CheckCircle2, color: 'var(--success)' },
            { label: 'Membres actifs', value: '12', icon: Users, color: 'var(--info)' },
            { label: 'Votes organisés', value: '3', icon: Vote, color: 'var(--warning)' },
            { label: 'Réseau blockchain', value: 'Polygon', icon: RiShieldCheckLine, color: accentColor },
          ].map((s) => (
            <div key={s.label} className="card p-5 flex items-center gap-3">
              <div style={{ width: 40, height: 40, borderRadius: 10, background: `${s.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <s.icon size={18} style={{ color: s.color }} />
              </div>
              <div>
                <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>{s.value}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Balance chart */}
          <div className="card p-6 lg:col-span-2">
            <h2 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>Évolution du solde</h2>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16 }}>Depuis janvier 2026</p>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={MONTHLY} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradPublic" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={accentColor} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={accentColor} stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
                <XAxis dataKey="month" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
                <Tooltip formatter={(v: number) => [formatFCFA(v), 'Solde']} contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-strong)', borderRadius: 8, fontSize: 12 }} />
                <Area type="monotone" dataKey="balance" stroke={accentColor} strokeWidth={2.5} fill="url(#gradPublic)" dot={false} activeDot={{ r: 5, fill: accentColor }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Pie */}
          <div className="card p-6">
            <h2 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>Répartition</h2>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>Types de transactions</p>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={PIE_DATA} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" paddingAngle={3}>
                  {PIE_DATA.map((e, i) => <Cell key={i} fill={e.color} strokeWidth={0} />)}
                </Pie>
                <Tooltip formatter={(v: number) => `${v}%`} contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-strong)', borderRadius: 8, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-2 mt-2">
              {PIE_DATA.map((d) => (
                <div key={d.name} className="flex items-center justify-between" style={{ fontSize: 12 }}>
                  <div className="flex items-center gap-2">
                    <span style={{ width: 8, height: 8, borderRadius: 2, background: d.color, display: 'inline-block' }} />
                    <span style={{ color: 'var(--text-secondary)' }}>{d.name}</span>
                  </div>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{d.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent transactions */}
        <div className="card mb-8">
          <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
            <h2 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>Transactions récentes</h2>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Toutes vérifiables sur Polygonscan</span>
          </div>
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
                </tr>
              </thead>
              <tbody>
                {PUBLIC_TRANSACTIONS.map((tx: typeof PUBLIC_TRANSACTIONS[0]) => (
                  <tr key={tx.id}>
                    <td style={{ fontSize: 13, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>{formatDate(tx.transaction_date)}</td>
                    <td style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 500 }}>{tx.description}</td>
                    <td>
                      <span style={{ fontSize: 12, background: `${TX_TYPE_COLORS[tx.tx_type as keyof typeof TX_TYPE_COLORS]}18`, color: TX_TYPE_COLORS[tx.tx_type as keyof typeof TX_TYPE_COLORS], padding: '3px 8px', borderRadius: 12, fontWeight: 500 }}>
                        {TX_TYPE_LABELS[tx.tx_type as keyof typeof TX_TYPE_LABELS]}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontWeight: 700, color: tx.direction === 'IN' ? 'var(--success)' : 'var(--danger)' }}>
                        {tx.direction === 'IN' ? '+' : '-'}{formatFCFA(tx.amount_fcfa)}
                      </span>
                    </td>
                    <td><BlockchainStatus status={tx.blockchain_status as 'CONFIRMED' | 'PENDING' | 'FAILED'} /></td>
                    <td>
                      {tx.polygon_tx_hash
                        ? <a href={`https://polygon-amoy.g.alchemy.com/v2/${tx.polygon_tx_hash}`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--info)', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
                            <RiExternalLinkLine size={12} /> Voir
                          </a>
                        : <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>—</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Votes public */}
        <div className="card mb-8">
          <div className="px-6 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
            <h2 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>Votes & Résolutions</h2>
          </div>
          <div className="flex flex-col gap-0">
            {PUBLIC_VOTES.map((vote, i) => {
              const total = vote.votes_for + vote.votes_against;
              const pct = total > 0 ? Math.round((vote.votes_for / total) * 100) : 0;
              return (
                <div key={vote.id} style={{ padding: '16px 24px', borderBottom: i < PUBLIC_VOTES.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
                  <div className="flex items-center justify-between gap-4 mb-3">
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{vote.title}</div>
                    <span className={`badge ${vote.status === 'OPEN' ? 'badge-accent' : (vote as typeof vote & { passed?: boolean }).passed ? 'badge-success' : 'badge-danger'}`} style={{ fontSize: 11, flexShrink: 0 }}>
                      {vote.status === 'OPEN' ? 'En cours' : (vote as typeof vote & { passed?: boolean }).passed ? 'Adopté' : 'Rejeté'}
                    </span>
                  </div>
                  <div style={{ height: 6, background: 'var(--border-subtle)', borderRadius: 3, marginBottom: 6, overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: 'var(--success)', borderRadius: 3 }} />
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                    {vote.votes_for} POUR · {vote.votes_against} CONTRE · quorum {total}/{vote.quorum_required}
                    {vote.status === 'OPEN' && ` · deadline ${formatDate(vote.deadline!)}`}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', padding: '32px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)' }}>
          <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: 22, color: 'var(--text-primary)', marginBottom: 8 }}>
            Vous êtes membre de cette coopérative ?
          </div>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 20 }}>
            Connectez-vous pour consulter votre espace personnel, voter sur les résolutions et suivre votre participation.
          </p>
          <Link href="/login" className="btn btn-primary btn-lg" style={{ textDecoration: 'none' }}>
            Accéder à mon espace <ArrowRight size={16} />
          </Link>
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: 40, fontSize: 12, color: 'var(--text-muted)' }}>
          CoopLedger · Hunter Chain TG-35 · MIABE Hackathon 2026 · Projet T-02
        </div>
      </main>
    </div>
  );
}
