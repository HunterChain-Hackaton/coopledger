'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useTheme } from '@/hooks/useTheme';
import {
  RiLeafLine, RiSunLine, RiArrowLeftLine, RiMenuLine, RiCloseLine,
  RiShieldCheckLine, RiSmartphoneLine, RiBarChartLine, RiGovernmentLine,
  RiGlobalLine, RiTeamLine, RiExternalLinkLine, RiArrowRightLine,
} from 'react-icons/ri';
import { ArrowRight, Shield, Vote, TrendingUp, Users, Smartphone, FileText, HelpCircle, Info } from 'lucide-react';

const TEAM = [
  { name: 'Hunter Chain', role: 'Équipe TG-35', detail: 'Projet T-02 · MIABE Hackathon 2026' },
];

const ODD = [
  { code: 'ODD 1', color: '#e5243b', title: 'Fin de la pauvreté', desc: 'Meilleure gouvernance → accès aux financements → +30 à 50 % de revenus pour les agriculteurs membres.' },
  { code: 'ODD 16', color: '#00689d', title: 'Institutions efficaces', desc: 'Transparence totale des fonds collectifs. Smart contracts non contournables. Audit public ouvert à tous.' },
  { code: 'ODD 17', color: '#19486a', title: 'Partenariats', desc: 'Coopératives auditables = partenaires crédibles pour IFAD, banques agricoles, Ministère et microfinance.' },
];

const STACK = [
  { label: 'Blockchain', value: 'Polygon PoS — frais < 0,01 $, validation 2-5 s' },
  { label: 'Smart Contracts', value: 'Solidity — CoopLedgerVault.sol + CoopVote.sol' },
  { label: 'Backend', value: 'Django REST Framework (Python) + PostgreSQL' },
  { label: 'Web', value: 'Next.js (React) + Tailwind CSS' },
  { label: 'Mobile', value: 'React Native + Expo (Android & iOS)' },
  { label: 'Intégration Web3', value: 'Web3.py (backend) + ethers.js (frontend)' },
  { label: 'Auth', value: 'OTP SMS (Orange API Togo) + Biométrie Expo' },
  { label: 'Paiement', value: 'FedaPay — T-Money & Flooz (Mobile Money)' },
];

const STATS_PROB = [
  { value: '60 %', label: 'Coopératives togolaises à comptabilité 100 % papier', source: 'FAO / MIFA, 2021' },
  { value: '15–20 %', label: 'Fonds collectifs africains détournés chaque année', source: 'Transparency Int., 2022' },
  { value: '70 %', label: 'Membres citant l\'opacité comme raison de méfiance', source: 'CGIAR, 2022' },
  { value: '74,5 Mds$', label: 'Déficit de financement des coopératives africaines', source: 'ISF Advisors, 2022' },
  { value: '3×', label: 'Plus de financement pour les coopératives transparentes', source: 'IFAD, 2022' },
  { value: '+40 %', label: 'PIB togolais représenté par l\'agriculture', source: 'Banque Mondiale, 2023' },
];

export default function AboutPage() {
  const { theme, toggle } = useTheme();
  const isDry = theme === 'dry';
  const accent = isDry ? '#f07a2a' : '#059669';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <style>{`
        .about-nav-desktop { display: flex; align-items: center; gap: 8px; }
        .about-hamburger { display: none; }
        .about-hero-title { font-size: 46px; }
        .about-2col { grid-template-columns: 1fr 1fr; }
        .about-3col { grid-template-columns: repeat(3, 1fr); }
        .about-stats-grid { grid-template-columns: repeat(3, 1fr); }
        .about-stack-grid { grid-template-columns: repeat(2, 1fr); }
        .about-mockup-grid { grid-template-columns: repeat(3, 1fr); }
        .about-section-pad { padding: 80px 0; }
        .about-content-pad { padding: 0 24px; }

        @media (max-width: 900px) {
          .about-3col { grid-template-columns: repeat(2, 1fr); }
          .about-stats-grid { grid-template-columns: repeat(2, 1fr); }
          .about-mockup-grid { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 640px) {
          .about-nav-desktop { display: none; }
          .about-hamburger { display: flex; }
          .about-hero-title { font-size: 28px; line-height: 1.2; }
          .about-2col { grid-template-columns: 1fr; }
          .about-3col { grid-template-columns: 1fr; }
          .about-stats-grid { grid-template-columns: 1fr 1fr; }
          .about-stack-grid { grid-template-columns: 1fr; }
          .about-mockup-grid { grid-template-columns: 1fr 1fr; }
          .about-section-pad { padding: 48px 0; }
          .about-content-pad { padding: 0 16px; }
          .about-section-title { font-size: 24px !important; }
        }

        @media (max-width: 400px) {
          .about-stats-grid { grid-template-columns: 1fr; }
          .about-mockup-grid { grid-template-columns: 1fr; }
        }

        .about-mobile-drawer {
          display: none;
          position: fixed; inset: 0; z-index: 50;
          background: var(--bg-secondary);
          flex-direction: column;
        }
        .about-mobile-drawer.open { display: flex; }

        .glass-section {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
        }
      `}</style>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="about-mobile-drawer open">
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
            <Link href="/" onClick={() => setMobileMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 16px', borderRadius: 10, color: 'var(--text-primary)', textDecoration: 'none', fontSize: 15, fontWeight: 500, border: '1px solid var(--border-subtle)' }}>
              Accueil
            </Link>
            <Link href="/cooperatives" onClick={() => setMobileMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 16px', borderRadius: 10, color: 'var(--text-primary)', textDecoration: 'none', fontSize: 15, fontWeight: 500, border: '1px solid var(--border-subtle)' }}>
              Coopératives
            </Link>
            <Link href="/faq" onClick={() => setMobileMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 16px', borderRadius: 10, color: accent, textDecoration: 'none', fontSize: 15, fontWeight: 500, border: `1px solid ${accent}40` }}>
              FAQ
            </Link>
            <div style={{ flex: 1 }} />
            <button onClick={toggle} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: 'none', border: '1px solid var(--border)', borderRadius: 10, padding: '12px', cursor: 'pointer', color: 'var(--text-secondary)', fontSize: 13 }}>
              {isDry ? <RiSunLine size={15} /> : <RiLeafLine size={15} />}
              <span>{isDry ? 'Saison sèche' : 'Saison des pluies'}</span>
            </button>
            <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="btn btn-primary" style={{ textDecoration: 'none', justifyContent: 'center' }}>
              Connexion
            </Link>
          </div>
        </div>
      )}

      {/* Navbar */}
      <header style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-secondary)', position: 'sticky', top: 0, zIndex: 30 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 20px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none', color: 'var(--text-muted)', fontSize: 13 }}>
              <RiArrowLeftLine size={14} /> Accueil
            </Link>
            <span style={{ color: 'var(--border-strong)' }}>·</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 28, height: 28, borderRadius: 7, background: accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {isDry ? <RiSunLine size={14} color="white" /> : <RiLeafLine size={14} color="white" />}
              </div>
              <span style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-primary)' }}>CoopLedger</span>
            </div>
          </div>
          <div className="about-nav-desktop">
            <Link href="/cooperatives" style={{ textDecoration: 'none', color: 'var(--text-secondary)', fontSize: 13, padding: '6px 10px' }}>Coopératives</Link>
            <Link href="/faq" style={{ textDecoration: 'none', color: 'var(--text-secondary)', fontSize: 13, padding: '6px 10px' }}>FAQ</Link>
            <button onClick={toggle} style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 20, padding: '5px 12px', cursor: 'pointer', color: 'var(--text-secondary)', fontSize: 12, display: 'flex', alignItems: 'center', gap: 5 }}>
              {isDry ? <RiSunLine size={13} /> : <RiLeafLine size={13} />}
              <span>{isDry ? 'Sec' : 'Pluies'}</span>
            </button>
            <Link href="/login" className="btn btn-primary btn-sm" style={{ textDecoration: 'none' }}>Connexion</Link>
          </div>
          <button className="about-hamburger" onClick={() => setMobileMenuOpen(true)} style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 8, padding: '7px', cursor: 'pointer', color: 'var(--text-primary)', alignItems: 'center', justifyContent: 'center' }}>
            <RiMenuLine size={20} />
          </button>
        </div>
      </header>

      <main className="about-content-pad" style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* ── HERO ── */}
        <div className="about-section-pad" style={{ textAlign: 'center', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 14px', borderRadius: 20, background: 'var(--accent-subtle)', border: '1px solid var(--border)', marginBottom: 22 }}>
            <Info size={13} style={{ color: accent }} />
            <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>À propos du projet</span>
          </div>
          <h1 className="about-hero-title" style={{ fontFamily: 'DM Serif Display, serif', lineHeight: 1.15, color: 'var(--text-primary)', marginBottom: 18 }}>
            Rendre la transparence<br />
            <span style={{ color: accent }}>mathématiquement garantie</span>
          </h1>
          <p style={{ fontSize: 16, color: 'var(--text-secondary)', maxWidth: 640, margin: '0 auto 32px', lineHeight: 1.75 }}>
            CoopLedger est né d'un constat simple : 60 % des coopératives agricoles togolaises gèrent encore leurs finances sur papier, sans registre accessible, sans contrôle indépendant. La technologie blockchain permet de changer cela sans remplacer la confiance humaine — en la rendant inutile.
          </p>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10 }}>
            <RiShieldCheckLine size={14} style={{ color: accent }} />
            <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontFamily: 'IBM Plex Mono, monospace' }}>Polygon PoS Mainnet · Hash SHA-256 · AES-256</span>
          </div>
        </div>

        {/* ── LE PROBLÈME ── */}
        <div className="about-section-pad" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <h2 className="about-section-title" style={{ fontFamily: 'DM Serif Display, serif', fontSize: 32, color: 'var(--text-primary)', marginBottom: 12 }}>
              Le problème documenté
            </h2>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', maxWidth: 560, margin: '0 auto' }}>
              L'agriculture représente 40 % du PIB togolais et emploie 65 % de la population active. Pourtant, l'opacité financière des coopératives freine leur développement.
            </p>
          </div>
          <div className="about-stats-grid" style={{ display: 'grid', gap: 14 }}>
            {STATS_PROB.map((s) => (
              <div key={s.value} className="glass-section" style={{ padding: '20px 22px' }}>
                <div style={{ fontSize: 30, fontWeight: 900, color: accent, fontFamily: 'DM Serif Display, serif', marginBottom: 6 }}>{s.value}</div>
                <div style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 500, marginBottom: 6, lineHeight: 1.5 }}>{s.label}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'IBM Plex Mono, monospace' }}>{s.source}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── LA SOLUTION ── */}
        <div className="about-section-pad" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <h2 className="about-section-title" style={{ fontFamily: 'DM Serif Display, serif', fontSize: 32, color: 'var(--text-primary)', marginBottom: 12 }}>
              Une architecture hybride
            </h2>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', maxWidth: 580, margin: '0 auto' }}>
              CoopLedger ne stocke pas tout sur la blockchain — ce serait coûteux et lent. Il enregistre uniquement les empreintes cryptographiques qui garantissent l'immuabilité, tandis que les données complètes restent en base de données pour des performances optimales.
            </p>
          </div>

          <div className="about-2col" style={{ display: 'grid', gap: 16, marginBottom: 32 }}>
            <div className="glass-section" style={{ padding: 28, borderLeft: `3px solid ${accent}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <div style={{ width: 36, height: 36, borderRadius: 9, background: `${accent}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <RiShieldCheckLine size={18} style={{ color: accent }} />
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: accent, textTransform: 'uppercase', letterSpacing: '0.06em'}}>On-chain · Polygon</div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>Ce qui ne change jamais</div>
                </div>
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  'Hash SHA-256 de chaque transaction financière',
                  'Résultats de vote compressés avec timestamp',
                  'Hash du rapport mensuel PDF (certification)',
                ].map(item => (
                  <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: accent, marginTop: 6, flexShrink: 0 }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="glass-section" style={{ padding: 28, borderLeft: '3px solid var(--border-strong)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <div style={{ width: 36, height: 36, borderRadius: 9, background: 'var(--accent-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <RiBarChartLine size={18} style={{ color: 'var(--text-secondary)' }} />
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Off-chain · PostgreSQL</div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>Ce qui est consulté au quotidien</div>
                </div>
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  'Données complètes des transactions (montant, description, pièce jointe)',
                  'Profils membres, rôles et historique',
                  'Détail des votes, rapports PDF, notifications',
                ].map(item => (
                  <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--text-muted)', marginTop: 6, flexShrink: 0 }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Stack technique */}
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 16, textAlign: 'center' }}>Stack technique</h3>
            <div className="about-stack-grid" style={{ display: 'grid', gap: 10 }}>
              {STACK.map((s) => (
                <div key={s.label} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '14px 16px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 10 }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: accent, textTransform: 'uppercase', letterSpacing: '0.04em', minWidth: 90, paddingTop: 1 }}>{s.label}</span>
                  <span style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── MAQUETTES APP ── */}
        <div className="about-section-pad" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <h2 className="about-section-title" style={{ fontFamily: 'DM Serif Display, serif', fontSize: 32, color: 'var(--text-primary)', marginBottom: 12 }}>
              L'application en images
            </h2>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', maxWidth: 480, margin: '0 auto' }}>
              Deux interfaces complémentaires : un tableau de bord web pour les gestionnaires, une application mobile pour les membres agriculteurs.
            </p>
          </div>

          <div className="about-mockup-grid" style={{ display: 'grid', gap: 16, marginBottom: 16 }}>
            {['image_maquette_1.png', 'image_maquette_2.png', 'image_maquette_3.png'].map((img, i) => (
              <div key={img} className="glass-section" style={{ overflow: 'hidden', aspectRatio: '9/16', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, background: `linear-gradient(135deg, ${accent}08 0%, ${accent}03 100%)` }}>
                <img src={`/${img}`} alt={`Maquette ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  onError={(e) => {
                    const el = e.currentTarget;
                    el.style.display = 'none';
                    const parent = el.parentElement;
                    if (parent) {
                      parent.innerHTML = `<div style="display:flex;flex-direction:column;align-items:center;gap:10px;padding:24px;text-align:center">
                        <div style="width:48px;height:48px;border-radius:12px;background:${accent}18;display:flex;align-items:center;justify-content:center;">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${accent}" stroke-width="1.5"><rect x="5" y="2" width="14" height="20" rx="2"/><circle cx="12" cy="17" r="1"/></svg>
                        </div>
                        <div style="font-size:12px;color:var(--text-muted);font-family:IBM Plex Mono,monospace">${img}</div>
                        <div style="font-size:11px;color:var(--text-muted)">Maquette ${i + 1} — à placer</div>
                      </div>`;
                    }
                  }}
                />
              </div>
            ))}
          </div>

          <div className="about-mockup-grid" style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(3, 1fr)' }}>
            {['image_maquette_4.png', 'image_maquette_5.png', 'image_maquette_6.png'].map((img, i) => (
              <div key={img} className="glass-section" style={{ overflow: 'hidden', aspectRatio: '16/10', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, background: `linear-gradient(135deg, ${accent}06 0%, ${accent}02 100%)` }}>
                <img src={`/${img}`} alt={`Maquette web ${i + 4}`} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  onError={(e) => {
                    const el = e.currentTarget;
                    el.style.display = 'none';
                    const parent = el.parentElement;
                    if (parent) {
                      parent.innerHTML = `<div style="display:flex;flex-direction:column;align-items:center;gap:10px;padding:24px;text-align:center">
                        <div style="width:44px;height:44px;border-radius:10px;background:${accent}18;display:flex;align-items:center;justify-content:center;">
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="${accent}" stroke-width="1.5"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>
                        </div>
                        <div style="font-size:12px;color:var(--text-muted);font-family:IBM Plex Mono,monospace">${img}</div>
                        <div style="font-size:11px;color:var(--text-muted)">Maquette ${i + 4} — à placer</div>
                      </div>`;
                    }
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* ── IMPACT / ODD ── */}
        <div className="about-section-pad" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <h2 className="about-section-title" style={{ fontFamily: 'DM Serif Display, serif', fontSize: 32, color: 'var(--text-primary)', marginBottom: 12 }}>
              Impact & Objectifs de Développement Durable
            </h2>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', maxWidth: 540, margin: '0 auto' }}>
              CoopLedger contribue directement à 3 ODD des Nations Unies et à la vision du développement durable au Togo.
            </p>
          </div>
          <div className="about-3col" style={{ display: 'grid', gap: 16 }}>
            {ODD.map((o) => (
              <div key={o.code} className="glass-section" style={{ padding: 24, borderTop: `3px solid ${o.color}` }}>
                <div style={{ display: 'inline-flex', padding: '4px 10px', borderRadius: 20, background: `${o.color}18`, marginBottom: 14 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: o.color, letterSpacing: '0.04em' }}>{o.code}</span>
                </div>
                <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 10 }}>{o.title}</div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.65 }}>{o.desc}</div>
              </div>
            ))}
          </div>

          {/* Pourquoi Polygon */}
          <div className="glass-section" style={{ padding: 28, marginTop: 16, display: 'flex', alignItems: 'flex-start', gap: 20 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: `${accent}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <RiGlobalLine size={20} style={{ color: accent }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 10 }}>Pourquoi Polygon — Alignement développement durable</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10 }}>
                {[
                  ['Proof of Stake', '–99,9 % d\'énergie vs Bitcoin'],
                  ['Frais quasi nuls', '0,001 $ à 0,01 $ par transaction'],
                  ['Audit public', 'Tout vérifiable sans permission sur PolygonScan'],
                  ['Immuabilité', 'Smart contracts non contournables'],
                ].map(([titre, desc]) => (
                  <div key={titre} style={{ padding: '12px 14px', background: 'var(--bg-primary)', borderRadius: 8, border: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: accent, marginBottom: 3 }}>{titre}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5 }}>{desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── ÉQUIPE ── */}
        <div className="about-section-pad" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <h2 className="about-section-title" style={{ fontFamily: 'DM Serif Display, serif', fontSize: 32, color: 'var(--text-primary)', marginBottom: 12 }}>
              L'équipe
            </h2>
          </div>
          <div style={{ maxWidth: 500, margin: '0 auto' }}>
            <div className="glass-section" style={{ padding: 28, textAlign: 'center' }}>
              <div style={{ width: 64, height: 64, borderRadius: 20, background: `${accent}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <RiTeamLine size={30} style={{ color: accent }} />
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>Hunter Chain</div>
              <div style={{ fontSize: 14, color: accent, fontWeight: 500, marginBottom: 6 }}>Équipe TG-35</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20 }}>Projet T-02 · MIABE Hackathon 2026 · Togo</div>
              <div style={{ padding: '14px 20px', background: 'var(--bg-primary)', borderRadius: 10, border: '1px solid var(--border-subtle)' }}>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.65 }}>
                  CoopLedger a été conçu pour le MIABE Hackathon 2026 sous le thème « La Blockchain, levier du développement durable africain ». Notre vision : déployer sur 5 coopératives pilotes réelles au Togo dans les 6 mois suivant la finale, puis étendre au Bénin, Côte d'Ivoire et Sénégal.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── CTA ── */}
        <div className="about-section-pad" style={{ textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 26, color: 'var(--text-primary)', marginBottom: 10 }}>
            Prêt à rejoindre le mouvement ?
          </h2>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 28, maxWidth: 440, margin: '0 auto 28px', lineHeight: 1.7 }}>
            Inscrivez votre coopérative ou explorez les données publiques des coopératives déjà transparentes.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/cooperatives" className="btn btn-secondary btn-lg" style={{ textDecoration: 'none' }}>
              Explorer les coopératives
            </Link>
            <Link href="/cooperatives/apply" className="btn btn-primary btn-lg" style={{ textDecoration: 'none' }}>
              Inscrire ma coopérative <ArrowRight size={16} />
            </Link>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border)', background: 'var(--bg-secondary)', padding: '28px 24px', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 10 }}>
          <div style={{ width: 26, height: 26, borderRadius: 7, background: accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {isDry ? <RiSunLine size={13} color="white" /> : <RiLeafLine size={13} color="white" />}
          </div>
          <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: 14 }}>CoopLedger</span>
        </div>
        <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Projet T-02 · Hunter Chain TG-35 · MIABE Hackathon 2026 · Togo</p>
      </footer>
    </div>
  );
}
