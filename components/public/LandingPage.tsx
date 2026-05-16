'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from '@/hooks/useTheme';
import { publicApi } from '@/lib/api';
import { PublicCooperative } from '@/types';
import { MOCK_COOPERATIVES } from '@/lib/mockdata';
import { formatFCFA } from '@/lib/utils';
import {
  RiLeafLine, RiSunLine, RiShieldCheckLine,
  RiSmartphoneLine, RiArrowRightLine, RiExternalLinkLine,
  RiBuildingLine, RiGroupLine, RiBarChartLine,
} from 'react-icons/ri';
import { ArrowRight, Shield, TrendingUp, Users, Vote, CheckCircle2 } from 'lucide-react';

// ── Contenu vitrine (depuis index.html fourni) ─────────────────────────────
const FEATURES = [
  {
    icon: Shield,
    title: 'Transparence totale',
    desc: 'Chaque transaction est ancrée sur la blockchain Polygon. Aucun détournement ne peut être dissimulé.',
  },
  {
    icon: Vote,
    title: 'Gouvernance démocratique',
    desc: 'Les membres votent sur les décisions importantes. Les résultats sont immuables et publics.',
  },
  {
    icon: TrendingUp,
    title: 'Accès au financement',
    desc: 'Les coopératives transparentes lèvent 3× plus de financement externe (IFAD, 2022).',
  },
  {
    icon: Users,
    title: 'Confiance des membres',
    desc: '70 % des membres citent l\'opacité comme première raison de méfiance. CoopLedger y répond.',
  },
];

const STATS = [
  { label: 'Coopératives actives',    value: '3+' },
  { label: 'Transactions confirmées', value: '70+' },
  { label: 'Membres inscrits',        value: '35+' },
  { label: 'Réseau blockchain',       value: 'Polygon' },
];

export default function LandingPage() {
  const { theme, toggle } = useTheme();
  const isDry = theme === 'dry';
  const accent = isDry ? '#f07a2a' : '#059669';

  const [coops,   setCoops]   = useState<PublicCooperative[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    publicApi.listCooperatives()
      .then((r) => setCoops((r.data.results ?? r.data).slice(0, 3)))
      .catch(() => setCoops(MOCK_COOPERATIVES.slice(0, 3)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* ── NAVBAR ───────────────────────────────────────────────────── */}
      <header style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-secondary)', position: 'sticky', top: 0, zIndex: 20 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 34, height: 34, borderRadius: 9, background: accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {isDry ? <RiSunLine size={18} color="white" /> : <RiLeafLine size={18} color="white" />}
            </div>
            <span style={{ fontWeight: 700, fontSize: 16, color: 'var(--text-primary)' }}>CoopLedger</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={toggle} style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 20, padding: '5px 12px', cursor: 'pointer', color: 'var(--text-secondary)', fontSize: 12, display: 'flex', alignItems: 'center', gap: 5 }}>
              {isDry ? <RiSunLine size={13} /> : <RiLeafLine size={13} />}
              <span>{isDry ? 'Saison sèche' : 'Pluies'}</span>
            </button>
            <Link href="/cooperatives/apply" className="btn btn-secondary btn-sm" style={{ textDecoration: 'none' }}>
              Inscrire ma coopérative
            </Link>
            <Link href="/login" className="btn btn-primary btn-sm" style={{ textDecoration: 'none' }}>
              Connexion <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>
        {/* ── HERO ─────────────────────────────────────────────────────── */}
        <div style={{ padding: '72px 0 56px', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 20, background: 'var(--accent-subtle)', border: '1px solid var(--border)', marginBottom: 24 }}>
            <RiShieldCheckLine size={14} style={{ color: accent }} />
            <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Sécurisé par Polygon PoS · MIABE Hackathon 2026</span>
          </div>
          <h1 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 52, lineHeight: 1.15, color: 'var(--text-primary)', marginBottom: 20 }}>
            La gouvernance financière<br />
            <span style={{ color: accent }}>transparente</span> pour vos coopératives
          </h1>
          <p style={{ fontSize: 18, color: 'var(--text-secondary)', maxWidth: 580, margin: '0 auto 36px', lineHeight: 1.7 }}>
            Chaque cotisation, chaque achat, chaque vote — enregistrés sur la blockchain Polygon, vérifiables par tous, modifiables par personne.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/cooperatives" className="btn btn-primary btn-lg" style={{ textDecoration: 'none' }}>
              Explorer les coopératives <ArrowRight size={16} />
            </Link>
            <Link href="/cooperatives/apply" className="btn btn-secondary btn-lg" style={{ textDecoration: 'none' }}>
              Inscrire ma coopérative
            </Link>
          </div>
        </div>

        {/* ── STATS ────────────────────────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 64 }}>
          {STATS.map((s) => (
            <div key={s.label} className="card" style={{ padding: '20px 24px', textAlign: 'center' }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: accent, marginBottom: 4 }}>{s.value}</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── FEATURES ─────────────────────────────────────────────────── */}
        <div style={{ marginBottom: 64 }}>
          <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 32, color: 'var(--text-primary)', textAlign: 'center', marginBottom: 8 }}>
            Pourquoi CoopLedger ?
          </h2>
          <p style={{ fontSize: 15, color: 'var(--text-secondary)', textAlign: 'center', marginBottom: 36 }}>
            15 à 20 % des fonds collectifs africains font l'objet de détournements chaque année (Transparency International, 2022).
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
            {FEATURES.map((f) => (
              <div key={f.title} className="card card-glow" style={{ padding: '28px 32px', display: 'flex', gap: 20 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: `${accent}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <f.icon size={22} style={{ color: accent }} />
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>{f.title}</div>
                  <div style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── COOPERATIVES PREVIEW ─────────────────────────────────────── */}
        <div style={{ marginBottom: 64 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
            <div>
              <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 28, color: 'var(--text-primary)', marginBottom: 4 }}>
                Coopératives transparentes
              </h2>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
                Données publiques — vérifiables sur Polygon
              </p>
            </div>
            <Link href="/cooperatives" className="btn btn-secondary btn-sm" style={{ textDecoration: 'none' }}>
              Voir toutes <ArrowRight size={13} />
            </Link>
          </div>

          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
              {[1,2,3].map(i => (
                <div key={i} className="card" style={{ padding: 24, height: 160, background: 'var(--bg-card-hover)' }} />
              ))}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
              {coops.map((coop) => (
                <CoopCard key={coop.id} coop={coop} accent={accent} />
              ))}
            </div>
          )}
        </div>

        {/* ── APP MOBILE ───────────────────────────────────────────────── */}
        <div className="card" style={{ padding: '40px 48px', marginBottom: 64, display: 'flex', alignItems: 'center', gap: 40, borderLeft: `4px solid ${accent}` }}>
          <div style={{ width: 64, height: 64, borderRadius: 18, background: `${accent}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <RiSmartphoneLine size={32} style={{ color: accent }} />
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>
              Application mobile disponible
            </h3>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 16 }}>
              Consultez le solde de votre coopérative, votez sur les résolutions et restez informé — même hors connexion. Disponible sur Android et iOS.
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              <a href="#" className="btn btn-primary btn-sm" style={{ textDecoration: 'none' }}>
                Android (APK) <RiArrowRightLine size={13} />
              </a>
              <a href="#" className="btn btn-secondary btn-sm" style={{ textDecoration: 'none' }}>
                iOS (TestFlight)
              </a>
            </div>
          </div>
        </div>

        {/* ── CTA INSCRIPTION ──────────────────────────────────────────── */}
        <div style={{ textAlign: 'center', padding: '48px 32px', marginBottom: 64, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)' }}>
          <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 28, color: 'var(--text-primary)', marginBottom: 10 }}>
            Votre coopérative n'est pas encore sur CoopLedger ?
          </h2>
          <p style={{ fontSize: 15, color: 'var(--text-secondary)', marginBottom: 24, maxWidth: 480, margin: '0 auto 24px' }}>
            Soumettez une demande d'inscription. Le Ministère de l'Agriculture valide les dossiers — vous recevez vos accès par email.
          </p>
          <Link href="/cooperatives/apply" className="btn btn-primary btn-lg" style={{ textDecoration: 'none' }}>
            Inscrire ma coopérative <ArrowRight size={16} />
          </Link>
        </div>
      </main>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <footer style={{ borderTop: '1px solid var(--border)', background: 'var(--bg-secondary)', padding: '32px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 12 }}>
            <div style={{ width: 28, height: 28, borderRadius: 7, background: accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {isDry ? <RiSunLine size={14} color="white" /> : <RiLeafLine size={14} color="white" />}
            </div>
            <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>CoopLedger</span>
          </div>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            Projet T-02 · Hunter Chain TG-35 · MIABE Hackathon 2026 · Togo
          </p>
        </div>
      </footer>
    </div>
  );
}

function CoopCard({ coop, accent }: { coop: PublicCooperative; accent: string }) {
  return (
    <Link href={`/cooperatives/${coop.id}`} style={{ textDecoration: 'none' }}>
      <div className="card card-glow" style={{ padding: 24, cursor: 'pointer', height: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: `${accent}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <RiBuildingLine size={20} style={{ color: accent }} />
          </div>
          <span className="badge badge-success" style={{ fontSize: 11 }}>Actif</span>
        </div>
        <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4, lineHeight: 1.4 }}>
          {coop.name}
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16 }}>
          {coop.region} · {coop.village}
        </div>
        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 12, display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>SOLDE</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: accent }}>{formatFCFA(coop.balance_fcfa)}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>MEMBRES</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>{coop.member_count}</div>
          </div>
        </div>
      </div>
    </Link>
  );
}