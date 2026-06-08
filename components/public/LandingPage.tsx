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
  RiMenuLine, RiCloseLine,
} from 'react-icons/ri';
import { ArrowRight, Shield, TrendingUp, Users, Vote, CheckCircle2, Info, HelpCircle } from 'lucide-react';

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    publicApi.listCooperatives()
      .then((r) => setCoops((r.data.results ?? r.data).slice(0, 3)))
      .catch(() => setCoops(MOCK_COOPERATIVES.slice(0, 3)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <style>{`
        /* ── RESPONSIVE UTILITIES ── */
        .nav-links-desktop { display: flex; align-items: center; gap: 8px; }
        .nav-menu-btn { display: none; }
        .mobile-nav-drawer {
          display: none;
          position: fixed; inset: 0; z-index: 50;
          background: var(--bg-secondary);
          flex-direction: column;
          padding: 0;
        }
        .mobile-nav-drawer.open { display: flex; }

        .hero-title { font-size: 52px; }
        .hero-subtitle { font-size: 18px; }
        .stats-grid { grid-template-columns: repeat(4, 1fr); }
        .features-grid { grid-template-columns: repeat(2, 1fr); }
        .coops-grid { grid-template-columns: repeat(3, 1fr); }
        .mobile-cta { flex-direction: row; }
        .app-card-inner { flex-direction: row; gap: 40px; padding: 40px 48px; }
        .app-card-icon { width: 64px; height: 64px; border-radius: 18px; flex-shrink: 0; }
        .app-buttons { flex-direction: row; }
        .section-header-row { flex-direction: row; align-items: center; justify-content: space-between; }
        .how-steps { grid-template-columns: repeat(3, 1fr); }
        .footer-inner { flex-direction: row; justify-content: space-between; align-items: flex-start; }
        .footer-links { flex-direction: row; gap: 24px; }

        @media (max-width: 900px) {
          .hero-title { font-size: 38px; }
          .coops-grid { grid-template-columns: repeat(2, 1fr); }
          .how-steps { grid-template-columns: repeat(2, 1fr); }
          .footer-inner { flex-direction: column; gap: 24px; align-items: center; text-align: center; }
          .footer-links { flex-direction: column; gap: 12px; align-items: center; }
        }

        @media (max-width: 640px) {
          .nav-links-desktop { display: none; }
          .nav-menu-btn { display: flex; }
          .hero-title { font-size: 28px; line-height: 1.2; }
          .hero-subtitle { font-size: 15px; }
          .stats-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
          .features-grid { grid-template-columns: 1fr; }
          .coops-grid { grid-template-columns: 1fr; }
          .mobile-cta { flex-direction: column; align-items: stretch; }
          .mobile-cta a, .mobile-cta button { text-align: center; justify-content: center; }
          .app-card-inner { flex-direction: column; gap: 20px; padding: 24px; }
          .app-card-icon { width: 48px; height: 48px; border-radius: 12px; }
          .app-buttons { flex-direction: column; gap: 8px; }
          .app-buttons a { justify-content: center; }
          .section-header-row { flex-direction: column; align-items: flex-start; gap: 12px; }
          .how-steps { grid-template-columns: 1fr; }
          .feature-card-inner { flex-direction: column; gap: 12px; }
          .feature-icon-box { width: 40px !important; height: 40px !important; }
          .cta-box { padding: 32px 20px !important; }
          .hero-section { padding: 48px 0 36px !important; }
          .main-pad { padding: 0 16px !important; }
          .section-mb { margin-bottom: 44px !important; }
        }

        @media (max-width: 400px) {
          .hero-title { font-size: 24px; }
          .stats-grid { grid-template-columns: 1fr 1fr; }
        }
      `}</style>

      {/* ── MOBILE NAV DRAWER ── */}
      {mobileMenuOpen && (
        <div className="mobile-nav-drawer open" style={{ animation: 'fadeIn 0.2s ease' }}>
          <div style={{ height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', borderBottom: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 30, height: 30, borderRadius: 8, background: accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {isDry ? <RiSunLine size={16} color="white" /> : <RiLeafLine size={16} color="white" />}
              </div>
              <span style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-primary)' }}>CoopLedger</span>
            </div>
            <button onClick={() => setMobileMenuOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', padding: 8 }}>
              <RiCloseLine size={22} />
            </button>
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '24px 20px', gap: 8 }}>
            <Link href="/cooperatives" onClick={() => setMobileMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 16px', borderRadius: 10, color: 'var(--text-primary)', textDecoration: 'none', fontSize: 15, fontWeight: 500, border: '1px solid var(--border-subtle)' }}>
              <RiBuildingLine size={18} style={{ color: accent }} /> Explorer les coopératives
            </Link>
            <Link href="/about" onClick={() => setMobileMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 16px', borderRadius: 10, color: 'var(--text-primary)', textDecoration: 'none', fontSize: 15, fontWeight: 500, border: '1px solid var(--border-subtle)' }}>
              <Info size={18} style={{ color: accent }} /> À propos
            </Link>
            <Link href="/faq" onClick={() => setMobileMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 16px', borderRadius: 10, color: 'var(--text-primary)', textDecoration: 'none', fontSize: 15, fontWeight: 500, border: '1px solid var(--border-subtle)' }}>
              <HelpCircle size={18} style={{ color: accent }} /> FAQ
            </Link>
            <div style={{ flex: 1 }} />
            <button onClick={toggle} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: 'none', border: '1px solid var(--border)', borderRadius: 10, padding: '12px', cursor: 'pointer', color: 'var(--text-secondary)', fontSize: 13, marginBottom: 8 }}>
              {isDry ? <RiSunLine size={15} /> : <RiLeafLine size={15} />}
              <span>{isDry ? 'Saison sèche' : 'Saison des pluies'}</span>
            </button>
            <Link href="/cooperatives/apply" onClick={() => setMobileMenuOpen(false)} className="btn btn-secondary" style={{ textDecoration: 'none', justifyContent: 'center' }}>
              Inscrire ma coopérative
            </Link>
            <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="btn btn-primary" style={{ textDecoration: 'none', justifyContent: 'center' }}>
              Connexion
            </Link>
          </div>
        </div>
      )}

      {/* ── NAVBAR ── */}
      <header style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-secondary)', position: 'sticky', top: 0, zIndex: 30 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 20px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 34, height: 34, borderRadius: 9, background: accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {isDry ? <RiSunLine size={18} color="white" /> : <RiLeafLine size={18} color="white" />}
            </div>
            <span style={{ fontWeight: 700, fontSize: 16, color: 'var(--text-primary)' }}>CoopLedger</span>
          </div>

          {/* Desktop nav */}
          <nav className="nav-links-desktop">
            <Link href="/cooperatives" style={{ textDecoration: 'none', color: 'var(--text-secondary)', fontSize: 13, fontWeight: 500, padding: '6px 10px', borderRadius: 8, transition: 'color 0.15s' }}>
              Coopératives
            </Link>
            <Link href="/about" style={{ textDecoration: 'none', color: 'var(--text-secondary)', fontSize: 13, fontWeight: 500, padding: '6px 10px', borderRadius: 8 }}>
              À propos
            </Link>
            <Link href="/faq" style={{ textDecoration: 'none', color: 'var(--text-secondary)', fontSize: 13, fontWeight: 500, padding: '6px 10px', borderRadius: 8 }}>
              FAQ
            </Link>
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
          </nav>

          {/* Mobile hamburger */}
          <button className="nav-menu-btn" onClick={() => setMobileMenuOpen(true)} style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 8, padding: '7px', cursor: 'pointer', color: 'var(--text-primary)', alignItems: 'center', justifyContent: 'center' }}>
            <RiMenuLine size={20} />
          </button>
        </div>
      </header>

      <main className="main-pad" style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>
        {/* ── HERO ── */}
        <div className="hero-section" style={{ padding: '72px 0 56px', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 20, background: 'var(--accent-subtle)', border: '1px solid var(--border)', marginBottom: 24 }}>
            <RiShieldCheckLine size={14} style={{ color: accent }} />
            <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Sécurisé par Polygon PoS · MIABE Hackathon 2026</span>
          </div>
          <h1 className="hero-title" style={{ fontFamily: 'DM Serif Display, serif', lineHeight: 1.15, color: 'var(--text-primary)', marginBottom: 20 }}>
            La gouvernance financière<br />
            <span style={{ color: accent }}>transparente</span> pour vos coopératives
          </h1>
          <p className="hero-subtitle" style={{ color: 'var(--text-secondary)', maxWidth: 560, margin: '0 auto 36px', lineHeight: 1.7 }}>
            Chaque cotisation, chaque achat, chaque vote — enregistrés sur la blockchain Polygon, vérifiables par tous, modifiables par personne.
          </p>
          <div className="mobile-cta" style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/cooperatives" className="btn btn-primary btn-lg" style={{ textDecoration: 'none' }}>
              Explorer les coopératives <ArrowRight size={16} />
            </Link>
            <Link href="/cooperatives/apply" className="btn btn-secondary btn-lg" style={{ textDecoration: 'none' }}>
              Inscrire ma coopérative
            </Link>
          </div>
        </div>

        {/* ── STATS ── */}
        <div className="stats-grid section-mb" style={{ display: 'grid', gap: 14, marginBottom: 60 }}>
          {STATS.map((s) => (
            <div key={s.label} className="card" style={{ padding: '18px 20px', textAlign: 'center' }}>
              <div style={{ fontSize: 26, fontWeight: 800, color: accent, marginBottom: 4 }}>{s.value}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── FEATURES ── */}
        <div className="section-mb" style={{ marginBottom: 60 }}>
          <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 30, color: 'var(--text-primary)', textAlign: 'center', marginBottom: 8 }}>
            Pourquoi CoopLedger ?
          </h2>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', textAlign: 'center', marginBottom: 32, maxWidth: 540, margin: '0 auto 32px' }}>
            15 à 20 % des fonds collectifs africains font l'objet de détournements chaque année (Transparency International, 2022).
          </p>
          <div className="features-grid" style={{ display: 'grid', gap: 16 }}>
            {FEATURES.map((f) => (
              <div key={f.title} className="card card-glow" style={{ padding: '24px 28px' }}>
                <div className="feature-card-inner" style={{ display: 'flex', gap: 18 }}>
                  <div className="feature-icon-box" style={{ width: 44, height: 44, borderRadius: 12, background: `${accent}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <f.icon size={22} style={{ color: accent }} />
                  </div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>{f.title}</div>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.65 }}>{f.desc}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── HOW IT WORKS ── */}
        <div className="section-mb" style={{ marginBottom: 60 }}>
          <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 30, color: 'var(--text-primary)', textAlign: 'center', marginBottom: 32 }}>
            Comment ça fonctionne ?
          </h2>
          <div className="how-steps" style={{ display: 'grid', gap: 16 }}>
            {[
              { n: '01', title: 'Inscription', desc: 'Le Ministère de l\'Agriculture valide votre coopérative. Les accès sont envoyés automatiquement au président.' },
              { n: '02', title: 'Enregistrement', desc: 'Le trésorier saisit chaque mouvement financier. Un hash cryptographique est ancré instantanément sur Polygon.' },
              { n: '03', title: 'Transparence', desc: 'Tous les membres consultent le solde, l\'historique et les votes depuis leur mobile, même hors connexion.' },
            ].map((step) => (
              <div key={step.n} className="card" style={{ padding: '24px 24px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ fontSize: 40, fontWeight: 900, color: `${accent}20`, fontFamily: 'DM Serif Display, serif', position: 'absolute', top: 8, right: 16, lineHeight: 1 }}>{step.n}</div>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: `${accent}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: accent }}>{step.n}</span>
                </div>
                <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>{step.title}</div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.65 }}>{step.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── COOPERATIVES PREVIEW ── */}
        <div className="section-mb" style={{ marginBottom: 60 }}>
          <div className="section-header-row" style={{ display: 'flex', marginBottom: 22, gap: 12 }}>
            <div>
              <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 26, color: 'var(--text-primary)', marginBottom: 4 }}>
                Coopératives transparentes
              </h2>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                Données publiques — vérifiables sur Polygon
              </p>
            </div>
            <Link href="/cooperatives" className="btn btn-secondary btn-sm" style={{ textDecoration: 'none', flexShrink: 0 }}>
              Voir toutes <ArrowRight size={13} />
            </Link>
          </div>

          {loading ? (
            <div className="coops-grid" style={{ display: 'grid', gap: 14 }}>
              {[1,2,3].map(i => (
                <div key={i} className="card" style={{ padding: 24, height: 150, background: 'var(--bg-card-hover)' }} />
              ))}
            </div>
          ) : (
            <div className="coops-grid" style={{ display: 'grid', gap: 14 }}>
              {coops.map((coop) => (
                <CoopCard key={coop.id} coop={coop} accent={accent} />
              ))}
            </div>
          )}
        </div>

        {/* ── APP MOBILE ── */}
        <div className="card section-mb" style={{ marginBottom: 60, borderLeft: `4px solid ${accent}` }}>
          <div className="app-card-inner" style={{ display: 'flex', alignItems: 'center' }}>
            <div className="app-card-icon" style={{ background: `${accent}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <RiSmartphoneLine size={28} style={{ color: accent }} />
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>
                Application mobile disponible
              </h3>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: 16 }}>
                Consultez le solde de votre coopérative, votez sur les résolutions et restez informé — même hors connexion. Disponible sur Android et iOS.
              </p>
              <div className="app-buttons" style={{ display: 'flex', gap: 10 }}>
                <a href="/coopledger.apk" download className="btn btn-primary btn-sm" style={{ textDecoration: 'none' }}>
                  Android (APK) <RiArrowRightLine size={13} />
                </a>
                <a href="#" className="btn btn-secondary btn-sm" style={{ textDecoration: 'none' }}>
                  iOS (TestFlight)
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ── CTA INSCRIPTION ── */}
        <div className="cta-box section-mb" style={{ textAlign: 'center', padding: '48px 32px', marginBottom: 60, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)' }}>
          <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 26, color: 'var(--text-primary)', marginBottom: 10 }}>
            Votre coopérative n'est pas encore sur CoopLedger ?
          </h2>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 24, maxWidth: 460, margin: '0 auto 24px', lineHeight: 1.7 }}>
            Soumettez une demande d'inscription. Le Ministère de l'Agriculture valide les dossiers — vous recevez vos accès par email.
          </p>
          <Link href="/cooperatives/apply" className="btn btn-primary btn-lg" style={{ textDecoration: 'none' }}>
            Inscrire ma coopérative <ArrowRight size={16} />
          </Link>
        </div>
      </main>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: '1px solid var(--border)', background: 'var(--bg-secondary)', padding: '36px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div className="footer-inner" style={{ display: 'flex', marginBottom: 24, gap: 20 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 28, height: 28, borderRadius: 7, background: accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {isDry ? <RiSunLine size={14} color="white" /> : <RiLeafLine size={14} color="white" />}
                </div>
                <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: 15 }}>CoopLedger</span>
              </div>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', maxWidth: 240, lineHeight: 1.6 }}>
                Gouvernance financière transparente pour les coopératives agricoles togolaises.
              </p>
            </div>
            <nav className="footer-links" style={{ display: 'flex' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Plateforme</span>
                <Link href="/cooperatives" style={{ fontSize: 13, color: 'var(--text-secondary)', textDecoration: 'none' }}>Coopératives</Link>
                <Link href="/cooperatives/apply" style={{ fontSize: 13, color: 'var(--text-secondary)', textDecoration: 'none' }}>Inscription</Link>
                <Link href="/login" style={{ fontSize: 13, color: 'var(--text-secondary)', textDecoration: 'none' }}>Connexion</Link>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Ressources</span>
                <Link href="/about" style={{ fontSize: 13, color: 'var(--text-secondary)', textDecoration: 'none' }}>À propos</Link>
                <Link href="/faq" style={{ fontSize: 13, color: 'var(--text-secondary)', textDecoration: 'none' }}>FAQ</Link>
                <a href="https://amoy.polygonscan.com" target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, color: 'var(--text-secondary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>PolygonScan <RiExternalLinkLine size={11} /></a>
              </div>
            </nav>
          </div>
          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 20, textAlign: 'center' }}>
            <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              Projet T-02 · Hunter Chain TG-35 · MIABE Hackathon 2026 · Togo
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function CoopCard({ coop, accent }: { coop: PublicCooperative; accent: string }) {
  return (
    <Link href={`/cooperatives/${coop.id}`} style={{ textDecoration: 'none' }}>
      <div className="card card-glow" style={{ padding: 22, cursor: 'pointer', height: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: `${accent}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <RiBuildingLine size={19} style={{ color: accent }} />
          </div>
          <span className="badge badge-success" style={{ fontSize: 11 }}>Actif</span>
        </div>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4, lineHeight: 1.4 }}>
          {coop.name}
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 14 }}>
          {coop.region} · {coop.village}
        </div>
        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 12, display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>SOLDE</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: accent }}>{formatFCFA(coop.balance_fcfa)}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>MEMBRES</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>{coop.member_count}</div>
          </div>
        </div>
      </div>
    </Link>
  );
}
