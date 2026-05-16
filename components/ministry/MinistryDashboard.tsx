'use client';
import { useState, useEffect } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/hooks/useAuth';
import { ministryApi } from '@/lib/api';
import { CoopApplication, PublicCooperative } from '@/types';
import { formatDate, formatFCFA } from '@/lib/utils';
import { Modal, showToast } from '@/components/ui';
import { RiCheckLine, RiCloseLine, RiPhoneLine, RiBuildingLine } from 'react-icons/ri';
import { useRouter } from 'next/navigation';

export default function MinistryDashboard() {
  const { user, loading: authLoading } = useAuth();
  const { theme } = useTheme();
  const isDry = theme === 'dry';
  const accent = isDry ? '#f07a2a' : '#059669';
  const router = useRouter();

  const [tab,          setTab]        = useState<'applications' | 'cooperatives'>('applications');
  const [applications, setApps]       = useState<CoopApplication[]>([]);
  const [coops,        setCoops]      = useState<PublicCooperative[]>([]);
  const [loading,      setLoading]    = useState(true);
  const [rejectModal,  setRejectModal]= useState<{ id: number; name: string } | null>(null);
  const [rejectReason, setRejectReason]=useState('');
  const [acting,       setActing]     = useState(false);

  useEffect(() => {
    if (!authLoading && user?.role !== 'MINISTRY' && user?.role !== 'ADMIN') {
      router.replace('/login');
    }
  }, [user, authLoading]);

  useEffect(() => {
    Promise.allSettled([
      ministryApi.listApplications(),
      ministryApi.listAllCooperatives(),
    ]).then(([appRes, coopRes]) => {
      if (appRes.status === 'fulfilled') setApps(appRes.value.data.results ?? appRes.value.data);
      if (coopRes.status === 'fulfilled') setCoops(coopRes.value.data.results ?? coopRes.value.data);
    }).finally(() => setLoading(false));
  }, []);

  const refresh = () => {
    setLoading(true);
    Promise.allSettled([
      ministryApi.listApplications(),
      ministryApi.listAllCooperatives(),
    ]).then(([appRes, coopRes]) => {
      if (appRes.status === 'fulfilled') setApps(appRes.value.data.results ?? appRes.value.data);
      if (coopRes.status === 'fulfilled') setCoops(coopRes.value.data.results ?? coopRes.value.data);
    }).finally(() => setLoading(false));
  };

  const handleApprove = async (id: number) => {
    setActing(true);
    try {
      await ministryApi.approveApplication(id);
      showToast('Coopérative approuvée. Email envoyé au président.', 'success');
      refresh();
    } catch { showToast('Erreur lors de l\'approbation.', 'error'); }
    finally { setActing(false); }
  };

  const handleReject = async () => {
    if (!rejectModal || !rejectReason.trim()) return;
    setActing(true);
    try {
      await ministryApi.rejectApplication(rejectModal.id, rejectReason);
      showToast('Demande refusée.', 'info');
      setRejectModal(null);
      setRejectReason('');
      refresh();
    } catch { showToast('Erreur.', 'error'); }
    finally { setActing(false); }
  };

  const pending  = applications.filter(a => a.status === 'PENDING');
  const approved = applications.filter(a => a.status === 'APPROVED');
  const rejected = applications.filter(a => a.status === 'REJECTED');

  if (authLoading || loading) {
    return <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span className="spinner" style={{ width: 32, height: 32 }} /></div>;
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Header */}
      <header style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-secondary)', padding: '0 24px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <RiBuildingLine size={16} color="white" />
          </div>
          <div>
            <span style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-primary)' }}>CoopLedger</span>
            <span style={{ fontSize: 12, color: 'var(--text-muted)', marginLeft: 8 }}>· Ministère de l'Agriculture</span>
          </div>
        </div>
        <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{user?.full_name}</span>
      </header>

      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>
        {/* Résumé */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
          {[
            { label: 'En attente', value: pending.length, color: 'var(--warning)' },
            { label: 'Approuvées', value: approved.length, color: 'var(--success)' },
            { label: 'Refusées',   value: rejected.length, color: 'var(--danger)' },
            { label: 'Coopératives actives', value: coops.length, color: accent },
          ].map(s => (
            <div key={s.label} className="card" style={{ padding: '16px 20px' }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: 'var(--bg-card)', borderRadius: 10, padding: 4, border: '1px solid var(--border)', width: 'fit-content' }}>
          {[
            { key: 'applications', label: `Demandes d'inscription (${applications.length})` },
            { key: 'cooperatives', label: `Coopératives (${coops.length})` },
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key as any)}
              style={{ padding: '8px 18px', borderRadius: 7, fontSize: 14, fontWeight: 500, border: 'none', cursor: 'pointer', background: tab === t.key ? accent : 'transparent', color: tab === t.key ? 'white' : 'var(--text-secondary)' }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Applications */}
        {tab === 'applications' && (
          <div className="card">
            <div style={{ padding: '14px 24px', borderBottom: '1px solid var(--border)' }}>
              <h2 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>Demandes d'inscription</h2>
            </div>
            {applications.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>Aucune demande</div>
            ) : (
              applications.map((app, i) => (
                <div key={app.id} style={{ padding: '20px 24px', borderBottom: i < applications.length - 1 ? '1px solid var(--border-subtle)' : 'none', display: 'flex', alignItems: 'flex-start', gap: 20 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                      <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>{app.name}</span>
                      <span className={`badge ${app.status === 'PENDING' ? 'badge-warning' : app.status === 'APPROVED' ? 'badge-success' : 'badge-danger'}`} style={{ fontSize: 11 }}>
                        {app.status === 'PENDING' ? 'En attente' : app.status === 'APPROVED' ? 'Approuvée' : 'Refusée'}
                      </span>
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)', display: 'flex', flexWrap: 'wrap', gap: '4px 16px' }}>
                      <span>Président : {app.president_name}</span>
                      <span>Email : {app.president_email}</span>
                      <span>{app.member_count} membres</span>
                      <span>{app.region}</span>
                      <span>NIF : {app.fiscal_number}</span>
                      <span>Soumis le {formatDate(app.submitted_at)}</span>
                    </div>
                    {app.rejection_reason && (
                      <div style={{ marginTop: 8, fontSize: 12, color: 'var(--danger)', background: 'var(--danger-bg)', padding: '6px 10px', borderRadius: 6 }}>
                        Motif de refus : {app.rejection_reason}
                      </div>
                    )}
                  </div>
                  {app.status === 'PENDING' && (
                    <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                      <button className="btn btn-sm" disabled={acting}
                        onClick={() => handleApprove(app.id)}
                        style={{ background: 'var(--success-bg)', color: 'var(--success)', borderColor: 'var(--success)', display: 'flex', alignItems: 'center', gap: 5 }}>
                        <RiCheckLine size={14} /> Approuver
                      </button>
                      <button className="btn btn-danger btn-sm" disabled={acting}
                        onClick={() => setRejectModal({ id: app.id, name: app.name })}
                        style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <RiCloseLine size={14} /> Refuser
                      </button>
                      <a href={`tel:${app.phone}`} className="btn btn-secondary btn-sm" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 5 }}>
                        <RiPhoneLine size={14} /> Contacter
                      </a>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* Coopératives */}
        {tab === 'cooperatives' && (
          <div className="card">
            <div style={{ padding: '14px 24px', borderBottom: '1px solid var(--border)' }}>
              <h2 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>Toutes les coopératives</h2>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr><th>Nom</th><th>Code</th><th>Région</th><th>Membres</th><th>Solde</th><th>Transactions</th><th>Statut</th></tr>
                </thead>
                <tbody>
                  {coops.map((c) => (
                    <tr key={c.id}>
                      <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{c.name}</td>
                      <td style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'IBM Plex Mono, monospace' }}>{c.code}</td>
                      <td style={{ fontSize: 13 }}>{c.region}</td>
                      <td style={{ fontSize: 13 }}>{c.member_count}</td>
                      <td style={{ fontWeight: 600, color: accent }}>{formatFCFA(c.balance_fcfa)}</td>
                      <td style={{ fontSize: 13 }}>{c.transaction_count}</td>
                      <td><span className={`badge ${c.is_active ? 'badge-success' : 'badge-muted'}`} style={{ fontSize: 11 }}>{c.is_active ? 'Actif' : 'Inactif'}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Modal refus */}
      <Modal open={!!rejectModal} onClose={() => setRejectModal(null)} title={`Refuser : ${rejectModal?.name}`}>
        <div>
          <label className="input-label">Motif du refus *</label>
          <textarea
            className="input" rows={4} value={rejectReason}
            onChange={e => setRejectReason(e.target.value)}
            placeholder="Expliquez la raison du refus..."
            style={{ resize: 'vertical' }}
          />
          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
            <button className="btn btn-secondary" onClick={() => setRejectModal(null)} style={{ flex: 1 }}>Annuler</button>
            <button className="btn btn-danger" onClick={handleReject} disabled={acting || !rejectReason.trim()} style={{ flex: 1 }}>
              {acting ? <span className="spinner" style={{ width: 16, height: 16 }} /> : 'Confirmer le refus'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}