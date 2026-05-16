'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from '@/hooks/useTheme';
import { publicApi } from '@/lib/api';
import { PublicCooperative } from '@/types';
import {
  MOCK_COOPERATIVES, MOCK_TRANSACTIONS,
  MOCK_VOTES, MOCK_SUMMARY,
} from '@/lib/mockdata';
import { formatFCFA, formatDate, TX_TYPE_LABELS, TX_TYPE_COLORS } from '@/lib/utils';
import { BlockchainStatus, HashDisplay } from '@/components/ui';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';
import {
  RiLeafLine, RiSunLine, RiShieldCheckLine,
  RiExternalLinkLine, RiArrowLeftLine,
} from 'react-icons/ri';
import { Users, Vote, TrendingUp, CheckCircle2, ArrowRight } from 'lucide-react';

export default function CooperativePublicPage({ coopId }: { coopId: number }) {
  const { theme, toggle } = useTheme();
  const isDry = theme === 'dry';
  const accent = isDry ? '#f07a2a' : '#059669';

  const [coop,   setCoop]   = useState<PublicCooperative | null>(null);
  const [txs,    setTxs]    = useState<typeof MOCK_TRANSACTIONS>([]);
  const [votes,  setVotes]  = useState<typeof MOCK_VOTES>([]);
  const [summary,setSummary]= useState<typeof MOCK_SUMMARY>(MOCK_SUMMARY);
  const [loading,setLoading]= useState(true);

  useEffect(() => {
    const fallback = MOCK_COOPERATIVES.find(c => c.id === coopId) ?? MOCK_COOPERATIVES[0];

    Promise.allSettled([
      publicApi.getCooperative(coopId),
      publicApi.getTransactions(coopId),
      publicApi.getVotes(coopId),
      publicApi.getSummary(coopId),
    ]).then(([coopRes, txRes, voteRes, sumRes]) => {
      setCoop(coopRes.status === 'fulfilled' ? coopRes.value.data : fallback);
      setTxs(txRes.status   === 'fulfilled' ? (txRes.value.data.results ?? txRes.value.data) : MOCK_TRANSACTIONS);
      setVotes(voteRes.status === 'fulfilled' ? (voteRes.value.data.results ?? voteRes.value.data) : MOCK_VOTES);
      setSummary(sumRes.status === 'fulfilled' ? sumRes.value.data : MOCK_SUMMARY);
    }).finally(() => setLoading(false));
  }, [coopId]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span className="spinner" style={{ width: 32, height: 32 }} />
      </div>
    );
  }

  const pieData = Object.entries(summary.by_category ?? {}).map(([k, v]: [string, any]) => ({
    name: v.label, value: v.value, color: TX_TYPE_COLORS[k as keyof typeof TX_TYPE_COLORS] ?? '#6b7280',
  }));

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Header — identique à PublicDashboard mais dynamique */}
      <header style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-secondary)', position: 'sticky', top: 0, zIndex: 20 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Link href="/cooperatives" style={{ display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none', color: 'var(--text-muted)', fontSize: 13 }}>
              <RiArrowLeftLine size={15} /> Coopératives
            </Link>
            <span style={{ color: 'var(--border)' }}>|</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 28, height: 28, borderRadius: 7, background: accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {isDry ? <RiSunLine size={14} color="white" /> : <RiLeafLine size={14} color="white" />}
              </div>
              <span style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-primary)' }}>CoopLedger</span>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>· {coop?.name ?? '—'}</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--success)' }}>
              <RiShieldCheckLine size={14} />
              <span>Polygon · Actif</span>
            </div>
            <button onClick={toggle} style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 20, padding: '5px 12px', cursor: 'pointer', color: 'var(--text-secondary)', fontSize: 12, display: 'flex', alignItems: 'center', gap: 5 }}>
              {isDry ? <RiSunLine size={13} /> : <RiLeafLine size={13} />}
            </button>
            <Link href="/login" className="btn btn-primary btn-sm" style={{ textDecoration: 'none' }}>
              Connexion <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>
        {/* Hero */}
        <div style={{ marginBottom: 32, padding: '28px 32px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', borderLeft: `4px solid ${accent}` }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
            <div>
              <h1 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 30, color: 'var(--text-primary)', marginBottom: 8 }}>
                {coop?.name}
              </h1>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {coop?.region} · {coop?.village} · Code : {coop?.code}
              </p>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', maxWidth: 500, lineHeight: 1.6, marginTop: 8 }}>
                Données financières publiques et vérifiables. Chaque transaction est ancrée sur la blockchain Polygon — transparence totale, sans intermédiaire.
              </p>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>SOLDE EN TEMPS RÉEL</div>
              <div style={{ fontSize: 36, fontWeight: 800, color: accent, fontFamily: 'Sora, sans-serif' }}>
                {formatFCFA(coop?.balance_fcfa ?? 0)}
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
          {[
            { label: 'Transactions confirmées', value: String(coop?.transaction_count ?? 0), icon: CheckCircle2, color: 'var(--success)' },
            { label: 'Membres actifs',           value: String(coop?.member_count ?? 0),     icon: Users,        color: 'var(--info)' },
            { label: 'Votes organisés',           value: String(coop?.vote_count ?? 0),       icon: Vote,         color: 'var(--warning)' },
            { label: 'Réseau blockchain',         value: 'Polygon',                           icon: RiShieldCheckLine, color: accent },
          ].map((s) => (
            <div key={s.label} className="card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
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
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20, marginBottom: 32 }}>
          <div className="card" style={{ padding: 24 }}>
            <h2 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>Évolution du solde</h2>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16 }}>Sur les derniers mois</p>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={summary.monthly} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={accent} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={accent} stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
                <XAxis dataKey="month" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
                <Tooltip formatter={(v: number) => [formatFCFA(v), 'Solde']} contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-strong)', borderRadius: 8, fontSize: 12 }} />
                <Area type="monotone" dataKey="balance" stroke={accent} strokeWidth={2.5} fill="url(#grad)" dot={false} activeDot={{ r: 5, fill: accent }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="card" style={{ padding: 24 }}>
            <h2 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>Répartition</h2>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>Par catégorie</p>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" paddingAngle={3}>
                  {pieData.map((e, i) => <Cell key={i} fill={e.color} strokeWidth={0} />)}
                </Pie>
                <Tooltip formatter={(v: number) => `${v}%`} contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-strong)', borderRadius: 8, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
              {pieData.map((d) => (
                <div key={d.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 8, height: 8, borderRadius: 2, background: d.color, display: 'inline-block' }} />
                    <span style={{ color: 'var(--text-secondary)' }}>{d.name}</span>
                  </div>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{d.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Transactions */}
        <div className="card" style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', borderBottom: '1px solid var(--border)' }}>
            <h2 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>Transactions récentes</h2>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Toutes vérifiables sur Polygonscan</span>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr><th>Date</th><th>Description</th><th>Catégorie</th><th>Montant</th><th>Blockchain</th><th>Preuve</th></tr>
              </thead>
              <tbody>
                {txs.slice(0, 10).map((tx: any) => (
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
                    <td><BlockchainStatus status={tx.blockchain_status} /></td>
                    <td>
                      {tx.polygon_tx_hash
                        ? <a href={`https://amoy.polygonscan.com/tx/${tx.polygon_tx_hash}`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--info)', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
                            <RiExternalLinkLine size={12} /> Voir
                          </a>
                        : <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>—</span>
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Votes */}
        <div className="card" style={{ marginBottom: 32 }}>
          <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border)' }}>
            <h2 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>Votes & Résolutions</h2>
          </div>
          {votes.map((vote: any, i: number) => {
            const total = vote.votes_for + vote.votes_against;
            const pct = total > 0 ? Math.round((vote.votes_for / total) * 100) : 0;
            return (
              <div key={vote.id} style={{ padding: '16px 24px', borderBottom: i < votes.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 10 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{vote.title}</div>
                  <span className={`badge ${vote.status === 'OPEN' ? 'badge-accent' : vote.passed ? 'badge-success' : 'badge-danger'}`} style={{ fontSize: 11, flexShrink: 0 }}>
                    {vote.status === 'OPEN' ? 'En cours' : vote.passed ? 'Adopté' : 'Rejeté'}
                  </span>
                </div>
                <div style={{ height: 6, background: 'var(--border-subtle)', borderRadius: 3, marginBottom: 6, overflow: 'hidden' }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: 'var(--success)', borderRadius: 3 }} />
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                  {vote.votes_for} POUR · {vote.votes_against} CONTRE · quorum {total}/{vote.quorum_required}
                  {vote.status === 'OPEN' && vote.deadline && ` · deadline ${formatDate(vote.deadline)}`}
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', padding: '32px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)' }}>
          <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: 22, color: 'var(--text-primary)', marginBottom: 8 }}>
            Vous êtes membre de cette coopérative ?
          </div>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 20 }}>
            Connectez-vous pour consulter votre espace personnel et voter sur les résolutions.
          </p>
          <Link href="/login" className="btn btn-primary btn-lg" style={{ textDecoration: 'none' }}>
            Accéder à mon espace <ArrowRight size={16} />
          </Link>
        </div>
      </main>
    </div>
  );
}