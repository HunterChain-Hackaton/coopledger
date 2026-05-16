'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useTheme } from '@/hooks/useTheme';
import { publicApi } from '@/lib/api';
import { RiLeafLine, RiSunLine, RiArrowLeftLine, RiCheckLine } from 'react-icons/ri';

const REGIONS = ['Maritime','Plateaux','Centrale','Kara','Savanes'];

export default function ApplyPage() {
  const { theme, toggle } = useTheme();
  const isDry = theme === 'dry';
  const accent = isDry ? '#f07a2a' : '#059669';

  const [form, setForm] = useState({
    name: '', president_name: '', president_email: '',
    phone: '', email: '', address: '',
    region: '', member_count: '', fiscal_number: '',
  });
  const [loading,   setLoading]   = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error,     setError]     = useState('');

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await publicApi.applyCooperative({ ...form, member_count: Number(form.member_count) });
      setSubmitted(true);
    } catch (err: any) {
      setError(err?.response?.data?.detail ?? 'Erreur lors de la soumission. Réessayez.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <header style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-secondary)', position: 'sticky', top: 0, zIndex: 20 }}>
        <div style={{ maxWidth: 760, margin: '0 auto', padding: '0 24px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none', color: 'var(--text-muted)', fontSize: 13 }}>
              <RiArrowLeftLine size={15} /> Accueil
            </Link>
            <span style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-primary)' }}>CoopLedger</span>
          </div>
          <button onClick={toggle} style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 20, padding: '5px 12px', cursor: 'pointer', color: 'var(--text-secondary)', fontSize: 12, display: 'flex', alignItems: 'center', gap: 5 }}>
            {isDry ? <RiSunLine size={13} /> : <RiLeafLine size={13} />}
          </button>
        </div>
      </header>

      <main style={{ maxWidth: 760, margin: '0 auto', padding: '48px 24px' }}>
        {submitted ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div style={{ width: 64, height: 64, borderRadius: 32, background: `${accent}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <RiCheckLine size={32} style={{ color: accent }} />
            </div>
            <h1 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 30, color: 'var(--text-primary)', marginBottom: 12 }}>
              Demande soumise
            </h1>
            <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.7, maxWidth: 440, margin: '0 auto 28px' }}>
              Le Ministère de l'Agriculture a reçu votre dossier. Vous serez contacté par email dans les meilleurs délais. En cas d'approbation, les accès du président seront envoyés par email.
            </p>
            <Link href="/" className="btn btn-primary" style={{ textDecoration: 'none' }}>
              Retour à l'accueil
            </Link>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: 36 }}>
              <h1 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 32, color: 'var(--text-primary)', marginBottom: 8 }}>
                Inscrire ma coopérative
              </h1>
              <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Soumettez votre dossier au Ministère de l'Agriculture du Togo. Après validation, un compte est créé automatiquement pour le président avec les accès envoyés par email.
              </p>
            </div>

            {error && (
              <div style={{ padding: '12px 16px', background: 'var(--danger-bg)', border: '1px solid var(--danger)', borderRadius: 8, marginBottom: 24, fontSize: 14, color: 'var(--danger)' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="card" style={{ padding: 28, marginBottom: 20 }}>
                <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 20, borderBottom: '1px solid var(--border-subtle)', paddingBottom: 12 }}>
                  La coopérative
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label className="input-label">Nom officiel de la coopérative *</label>
                    <input className="input" required value={form.name} onChange={e => set('name', e.target.value)} placeholder="Ex : Coopérative Agricole de Kpalimé" />
                  </div>
                  <div>
                    <label className="input-label">Région *</label>
                    <select className="input" required value={form.region} onChange={e => set('region', e.target.value)}>
                      <option value="">Choisir...</option>
                      {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="input-label">Adresse / Village *</label>
                    <input className="input" required value={form.address} onChange={e => set('address', e.target.value)} placeholder="Village ou commune" />
                  </div>
                  <div>
                    <label className="input-label">Numéro fiscal *</label>
                    <input className="input" required value={form.fiscal_number} onChange={e => set('fiscal_number', e.target.value)} placeholder="NIF ou RCCM" />
                  </div>
                  <div>
                    <label className="input-label">Nombre de membres actuels *</label>
                    <input className="input" type="number" min="2" required value={form.member_count} onChange={e => set('member_count', e.target.value)} placeholder="Ex : 12" />
                  </div>
                  <div>
                    <label className="input-label">Téléphone de contact *</label>
                    <input className="input" required value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+228 90 00 00 00" />
                  </div>
                  <div>
                    <label className="input-label">Email de la coopérative *</label>
                    <input className="input" type="email" required value={form.email} onChange={e => set('email', e.target.value)} placeholder="coop@exemple.tg" />
                  </div>
                </div>
              </div>

              <div className="card" style={{ padding: 28, marginBottom: 28 }}>
                <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 20, borderBottom: '1px solid var(--border-subtle)', paddingBottom: 12 }}>
                  Le président
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label className="input-label">Nom et prénom du président *</label>
                    <input className="input" required value={form.president_name} onChange={e => set('president_name', e.target.value)} placeholder="Prénom NOM" />
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label className="input-label">Email du président * <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>(recevra les accès)</span></label>
                    <input className="input" type="email" required value={form.president_email} onChange={e => set('president_email', e.target.value)} placeholder="president@exemple.tg" />
                  </div>
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ width: '100%' }}>
                {loading ? <span className="spinner" style={{ width: 18, height: 18 }} /> : 'Soumettre la demande'}
              </button>
            </form>
          </>
        )}
      </main>
    </div>
  );
}