'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from '@/hooks/useTheme';
import { publicApi } from '@/lib/api';
import { PublicCooperative } from '@/types';
import { MOCK_COOPERATIVES } from '@/lib/mockdata';
import { formatFCFA } from '@/lib/utils';
import { RiLeafLine, RiSunLine, RiBuildingLine, RiSearchLine } from 'react-icons/ri';
import { ArrowRight, ArrowLeft } from 'lucide-react';

export default function CooperativesListPage() {
  const { theme, toggle } = useTheme();
  const isDry = theme === 'dry';
  const accent = isDry ? '#f07a2a' : '#059669';

  const [coops,    setCoops]   = useState<PublicCooperative[]>([]);
  const [loading,  setLoading] = useState(true);
  const [search,   setSearch]  = useState('');

  useEffect(() => {
    publicApi.listCooperatives()
      .then((r) => setCoops(r.data.results ?? r.data))
      .catch(() => setCoops(MOCK_COOPERATIVES))
      .finally(() => setLoading(false));
  }, []);

  const filtered = coops.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.region.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Header */}
      <header style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-secondary)', position: 'sticky', top: 0, zIndex: 20 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
              <ArrowLeft size={16} style={{ color: 'var(--text-muted)' }} />
              <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Accueil</span>
            </Link>
            <span style={{ color: 'var(--border)' }}>|</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 28, height: 28, borderRadius: 7, background: accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {isDry ? <RiSunLine size={14} color="white" /> : <RiLeafLine size={14} color="white" />}
              </div>
              <span style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-primary)' }}>CoopLedger</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={toggle} style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 20, padding: '5px 12px', cursor: 'pointer', color: 'var(--text-secondary)', fontSize: 12, display: 'flex', alignItems: 'center', gap: 5 }}>
              {isDry ? <RiSunLine size={13} /> : <RiLeafLine size={13} />}
            </button>
            <Link href="/login" className="btn btn-primary btn-sm" style={{ textDecoration: 'none' }}>Connexion</Link>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px' }}>
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 36, color: 'var(--text-primary)', marginBottom: 8 }}>
            Coopératives agricoles
          </h1>
          <p style={{ fontSize: 15, color: 'var(--text-secondary)' }}>
            Données financières publiques — vérifiables sur la blockchain Polygon
          </p>
        </div>

        {/* Recherche */}
        <div style={{ position: 'relative', marginBottom: 28, maxWidth: 400 }}>
          <RiSearchLine size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            className="input"
            style={{ paddingLeft: 40 }}
            placeholder="Rechercher par nom ou région..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="card" style={{ padding: 24, height: 200 }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
            Aucune coopérative trouvée
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
            {filtered.map((coop) => (
              <Link key={coop.id} href={`/cooperatives/${coop.id}`} style={{ textDecoration: 'none' }}>
                <div className="card card-glow" style={{ padding: 24, cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: `${accent}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <RiBuildingLine size={20} style={{ color: accent }} />
                    </div>
                    <span className="badge badge-success" style={{ fontSize: 11 }}>Actif</span>
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4, lineHeight: 1.4 }}>{coop.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16 }}>{coop.region} · {coop.village} · {coop.code}</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, borderTop: '1px solid var(--border-subtle)', paddingTop: 12 }}>
                    {[
                      { label: 'Solde', val: formatFCFA(coop.balance_fcfa), color: accent },
                      { label: 'Membres', val: String(coop.member_count), color: 'var(--text-primary)' },
                      { label: 'Transactions', val: String(coop.transaction_count), color: 'var(--text-primary)' },
                    ].map((s) => (
                      <div key={s.label}>
                        <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 2, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{s.label}</div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: s.color }}>{s.val}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}