'use client';
import { useState, useEffect, useCallback } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/hooks/useAuth';
import { cotisationApi } from '@/lib/api';
import { CotisationCampaign, CotisationPayment } from '@/types';
import { formatFCFA, formatDate } from '@/lib/utils';
import { BlockchainStatus } from '@/components/ui';
import {
  RiAddLine, RiMoneyDollarCircleLine, RiCheckLine,
  RiCloseLine, RiSmartphoneLine, RiExternalLinkLine,
  RiRefreshLine,
} from 'react-icons/ri';
import { Users, TrendingUp } from 'lucide-react';

export default function CotisationsPage() {
  const { theme } = useTheme();
  const { user }  = useAuth();
  const isDry     = theme === 'dry';
  const accent    = isDry ? '#f07a2a' : '#059669';

  const isManager = user?.role === 'PRESIDENT' || user?.role === 'TREASURER';

  const [campaigns,    setCampaigns]   = useState<CotisationCampaign[]>([]);
  const [loading,      setLoading]     = useState(true);
  const [showCreate,   setShowCreate]  = useState(false);
  const [selectedPay,  setSelectedPay] = useState<CotisationCampaign | null>(null);
  const [selectedView, setSelectedView]= useState<CotisationCampaign | null>(null);
  const [payments,     setPayments]    = useState<CotisationPayment[]>([]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await cotisationApi.listCampaigns();
      setCampaigns(r.data);
    } catch {}
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, []);

  const loadPayments = async (id: number) => {
    try {
      const r = await cotisationApi.getPayments(id);
      setPayments(r.data);
    } catch {}
  };

  const handleViewCampaign = async (c: CotisationCampaign) => {
    setSelectedView(c);
    await loadPayments(c.id);
  };

  const openCampaigns   = campaigns.filter(c => c.status === 'OPEN');
  const closedCampaigns = campaigns.filter(c => c.status === 'CLOSED');

  return (
    <div style={{ padding: '32px 0' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontFamily: 'DM Serif Display,serif', fontSize: 28, color: 'var(--text-primary)', marginBottom: 4 }}>
            Cotisations
          </h1>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
            Collecte Mobile Money — T-Money · Flooz
          </p>
        </div>
        {isManager && (
          <button
            className="btn btn-primary"
            onClick={() => setShowCreate(true)}
            style={{ display: 'flex', alignItems: 'center', gap: 7 }}
          >
            <RiAddLine size={16} /> Nouvelle campagne
          </button>
        )}
      </div>

      {/* Résumé global */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 32 }}>
        {[
          {
            label: 'Campagnes ouvertes', value: String(openCampaigns.length),
            color: 'var(--success)', icon: RiMoneyDollarCircleLine,
          },
          {
            label: 'Total collecté',
            value: formatFCFA(campaigns.reduce((s, c) => s + c.total_collected_fcfa, 0)),
            color: accent, icon: TrendingUp,
          },
          {
            label: 'Membres ayant cotisé',
            value: String(campaigns.reduce((s, c) => s + c.paid_count, 0)),
            color: 'var(--info)', icon: Users,
          },
        ].map(s => (
          <div key={s.label} className="card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: `${s.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <s.icon size={20} style={{ color: s.color }} />
            </div>
            <div>
              <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>{s.value}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 48 }}><span className="spinner" style={{ width: 28, height: 28 }} /></div>
      ) : (
        <>
          {/* Campagnes ouvertes */}
          {openCampaigns.length > 0 && (
            <div style={{ marginBottom: 32 }}>
              <h2 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 14 }}>
                En cours
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16 }}>
                {openCampaigns.map(c => (
                  <CampaignCard
                    key={c.id} campaign={c} accent={accent}
                    isManager={isManager}
                    onPay={() => setSelectedPay(c)}
                    onView={() => handleViewCampaign(c)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Campagnes clôturées */}
          {closedCampaigns.length > 0 && (
            <div>
              <h2 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 14 }}>
                Clôturées
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16 }}>
                {closedCampaigns.map(c => (
                  <CampaignCard
                    key={c.id} campaign={c} accent={accent}
                    isManager={isManager}
                    onPay={() => {}}
                    onView={() => handleViewCampaign(c)}
                  />
                ))}
              </div>
            </div>
          )}

          {campaigns.length === 0 && (
            <div className="card" style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
              Aucune campagne de cotisation.
              {isManager && (
                <div style={{ marginTop: 16 }}>
                  <button className="btn btn-primary" onClick={() => setShowCreate(true)}>
                    Créer la première campagne
                  </button>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Modal création */}
      {showCreate && (
        <CreateCampaignModal
          accent={accent}
          onClose={() => setShowCreate(false)}
          onCreated={() => { setShowCreate(false); load(); }}
        />
      )}

      {/* Modal paiement membre */}
      {selectedPay && (
        <PaymentModal
          campaign={selectedPay}
          accent={accent}
          onClose={() => setSelectedPay(null)}
          onPaid={() => { setSelectedPay(null); load(); }}
        />
      )}

      {/* Modal détail / paiements */}
      {selectedView && (
        <CampaignDetailModal
          campaign={selectedView}
          payments={payments}
          accent={accent}
          isManager={isManager}
          onClose={() => { setSelectedView(null); setPayments([]); }}
          onClosed={() => { setSelectedView(null); load(); }}
        />
      )}
    </div>
  );
}

// ── Campaign Card ──────────────────────────────────────────────────────────────
function CampaignCard({
  campaign, accent, isManager, onPay, onView,
}: {
  campaign: CotisationCampaign; accent: string;
  isManager: boolean; onPay: () => void; onView: () => void;
}) {
  const pct      = campaign.progress_pct;
  const userPaid = campaign.user_payment?.status === 'CONFIRMED';
  const isOpen   = campaign.status === 'OPEN';

  return (
    <div className="card card-glow" style={{ padding: 24 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 3 }}>
            {campaign.title}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            Par {campaign.created_by_name} · {formatDate(campaign.created_at)}
          </div>
        </div>
        <span
          className={`badge ${isOpen ? 'badge-success' : 'badge-muted'}`}
          style={{ fontSize: 11, flexShrink: 0, marginLeft: 8 }}
        >
          {isOpen ? 'Ouverte' : 'Clôturée'}
        </span>
      </div>

      {/* Montant */}
      <div style={{ fontSize: 28, fontWeight: 800, color: accent, marginBottom: 14 }}>
        {formatFCFA(campaign.amount_fcfa)}
        <span style={{ fontSize: 13, fontWeight: 400, color: 'var(--text-muted)', marginLeft: 6 }}>/ membre</span>
      </div>

      {/* Barre de progression */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ height: 6, background: 'var(--border-subtle)', borderRadius: 3, overflow: 'hidden', marginBottom: 6 }}>
          <div style={{ width: `${pct}%`, height: '100%', background: accent, borderRadius: 3, transition: 'width 0.5s' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-muted)' }}>
          <span>{campaign.paid_count}/{campaign.target_count} membres</span>
          <span style={{ fontWeight: 600, color: accent }}>{pct}%</span>
        </div>
      </div>

      {/* Total collecté */}
      <div style={{ padding: '10px 12px', background: 'var(--bg-card-hover)', borderRadius: 8, marginBottom: 14, display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Total collecté</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--success)' }}>
          {formatFCFA(campaign.total_collected_fcfa)}
        </span>
      </div>

      {/* Target badge */}
      <div style={{ marginBottom: 14, fontSize: 12, color: 'var(--text-secondary)' }}>
        Cible :{' '}
        <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>
          {{ ALL: 'Tous les membres', FARMERS: 'Agriculteurs', MANUAL: 'Sélection manuelle' }[campaign.target]}
        </span>
        {campaign.deadline && (
          <span style={{ marginLeft: 10, color: 'var(--text-muted)' }}>
            · Deadline {formatDate(campaign.deadline)}
          </span>
        )}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 8 }}>
        {isOpen && !isManager && (
          userPaid ? (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '8px 16px', background: 'var(--success-bg)', borderRadius: 8, fontSize: 13, color: 'var(--success)', fontWeight: 500 }}>
              <RiCheckLine size={15} /> Cotisation payée
            </div>
          ) : (
            <button className="btn btn-primary" onClick={onPay} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              <RiSmartphoneLine size={15} /> Cotiser maintenant
            </button>
          )
        )}
        <button className="btn btn-secondary" onClick={onView} style={{ flex: isManager || !isOpen ? 1 : 0 }}>
          {isManager ? 'Voir les paiements' : 'Détails'}
        </button>
      </div>
    </div>
  );
}

// ── Create Campaign Modal ──────────────────────────────────────────────────────
function CreateCampaignModal({
  accent, onClose, onCreated,
}: { accent: string; onClose: () => void; onCreated: () => void }) {
  const [form, setForm] = useState({
    title: '', description: '', amount_fcfa: '',
    target: 'ALL', deadline: '',
    target_member_ids: [] as number[],
  });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');
  const [members, setMembers] = useState<{ id: number; full_name: string; is_farmer: boolean }[]>([]);

  useEffect(() => {
    if (form.target === 'MANUAL') {
      import('@/lib/api').then(({ api }) =>
        api.get('/cooperatives/members/').then(r => setMembers(r.data))
      );
    }
  }, [form.target]);

  const set = (k: string, v: unknown) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await cotisationApi.createCampaign({
        ...form,
        amount_fcfa: Number(form.amount_fcfa),
        deadline: form.deadline || undefined,
      });
      onCreated();
    } catch (err: any) {
      setError(err?.response?.data?.error ?? err?.response?.data?.detail ?? 'Erreur.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div className="card" style={{ width: '100%', maxWidth: 560, maxHeight: '90vh', overflowY: 'auto', padding: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>Nouvelle campagne</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4 }}>
            <RiCloseLine size={20} />
          </button>
        </div>

        {error && (
          <div style={{ padding: '10px 14px', background: 'var(--danger-bg)', border: '1px solid var(--danger)', borderRadius: 8, marginBottom: 16, fontSize: 13, color: 'var(--danger)' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label className="input-label">Titre de la campagne *</label>
              <input className="input" required value={form.title} onChange={e => set('title', e.target.value)} placeholder="Ex: Cotisation mensuelle Mai 2026" />
            </div>
            <div>
              <label className="input-label">Description</label>
              <textarea className="input" rows={2} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Objet de la cotisation..." style={{ resize: 'vertical' }} />
            </div>
            <div>
              <label className="input-label">Montant par membre (FCFA) *</label>
              <input className="input" type="number" min="100" required value={form.amount_fcfa} onChange={e => set('amount_fcfa', e.target.value)} placeholder="25000" />
            </div>
            <div>
              <label className="input-label">Membres ciblés *</label>
              <select className="input" value={form.target} onChange={e => set('target', e.target.value)}>
                <option value="ALL">Tous les membres</option>
                <option value="FARMERS">Agriculteurs uniquement</option>
                <option value="MANUAL">Sélection manuelle</option>
              </select>
            </div>

            {form.target === 'MANUAL' && members.length > 0 && (
              <div>
                <label className="input-label">Sélectionner les membres</label>
                <div style={{ maxHeight: 180, overflowY: 'auto', border: '1px solid var(--border)', borderRadius: 8, padding: 8 }}>
                  {members.map(m => (
                    <label key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 8px', cursor: 'pointer', borderRadius: 6 }}>
                      <input
                        type="checkbox"
                        checked={form.target_member_ids.includes(m.id)}
                        onChange={e => {
                          const ids = form.target_member_ids;
                          set('target_member_ids', e.target.checked ? [...ids, m.id] : ids.filter(i => i !== m.id));
                        }}
                      />
                      <span style={{ fontSize: 13, color: 'var(--text-primary)' }}>{m.full_name}</span>
                      {m.is_farmer && <span style={{ fontSize: 11, color: 'var(--success)', background: 'var(--success-bg)', padding: '1px 6px', borderRadius: 10 }}>Agriculteur</span>}
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="input-label">Date limite (optionnel)</label>
              <input className="input" type="datetime-local" value={form.deadline} onChange={e => set('deadline', e.target.value)} />
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
              <button type="button" className="btn btn-secondary" onClick={onClose} style={{ flex: 1 }}>Annuler</button>
              <button type="submit" className="btn btn-primary" disabled={loading} style={{ flex: 1 }}>
                {loading ? <span className="spinner" style={{ width: 16, height: 16 }} /> : 'Créer la campagne'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Payment Modal (membre) ─────────────────────────────────────────────────────
function PaymentModal({
  campaign, accent, onClose, onPaid,
}: { campaign: CotisationCampaign; accent: string; onClose: () => void; onPaid: () => void }) {
  const [phone,    setPhone]    = useState('');
  const [operator, setOperator] = useState('togocel');
  const [loading,  setLoading]  = useState(false);
  const [step,     setStep]     = useState<'form' | 'waiting' | 'done' | 'error'>('form');
  const [error,    setError]    = useState('');

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await cotisationApi.initiatePayment(campaign.id, { phone_number: phone, operator });
      setStep('waiting');
    } catch (err: any) {
      setError(err?.response?.data?.error ?? 'Erreur lors de l\'initiation du paiement.');
      setStep('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div className="card" style={{ width: '100%', maxWidth: 440, padding: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>Cotiser — {campaign.title}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <RiCloseLine size={20} />
          </button>
        </div>

        {/* Montant */}
        <div style={{ textAlign: 'center', padding: '20px 0', marginBottom: 24, borderBottom: '1px solid var(--border)' }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Montant à payer</div>
          <div style={{ fontSize: 36, fontWeight: 800, color: accent }}>{formatFCFA(campaign.amount_fcfa)}</div>
        </div>

        {step === 'form' && (
          <form onSubmit={handlePay}>
            <div style={{ marginBottom: 16 }}>
              <label className="input-label">Opérateur Mobile Money</label>
              <div style={{ display: 'flex', gap: 10 }}>
                {[
                  { value: 'togocel', label: 'T-Money', color: '#e53e3e' },
                  { value: 'moov',    label: 'Flooz',   color: '#3182ce' },
                ].map(op => (
                  <button
                    key={op.value} type="button"
                    onClick={() => setOperator(op.value)}
                    style={{
                      flex: 1, padding: '12px 8px', borderRadius: 10, cursor: 'pointer',
                      border: `2px solid ${operator === op.value ? op.color : 'var(--border)'}`,
                      background: operator === op.value ? `${op.color}18` : 'var(--bg-card)',
                      color: operator === op.value ? op.color : 'var(--text-secondary)',
                      fontSize: 14, fontWeight: 600, transition: 'all .15s',
                    }}
                  >
                    {op.label}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ marginBottom: 20 }}>
              <label className="input-label">Numéro de téléphone *</label>
              <input
                className="input" required type="tel"
                value={phone} onChange={e => setPhone(e.target.value)}
                placeholder="+228 90 00 00 00"
              />
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
                Vous recevrez une demande USSD sur ce numéro pour confirmer le paiement.
              </div>
            </div>
            {error && <div style={{ fontSize: 13, color: 'var(--danger)', marginBottom: 14 }}>{error}</div>}
            <div style={{ display: 'flex', gap: 10 }}>
              <button type="button" className="btn btn-secondary" onClick={onClose} style={{ flex: 1 }}>Annuler</button>
              <button type="submit" className="btn btn-primary" disabled={loading} style={{ flex: 1 }}>
                {loading ? <span className="spinner" style={{ width: 16, height: 16 }} /> : 'Payer maintenant'}
              </button>
            </div>
          </form>
        )}

        {step === 'waiting' && (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ width: 56, height: 56, borderRadius: 28, background: `${accent}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <RiSmartphoneLine size={28} style={{ color: accent }} />
            </div>
            <div style={{ fontSize: 17, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>Confirmez sur votre téléphone</div>
            <div style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 24 }}>
              Une demande USSD a été envoyée au <strong>{phone}</strong>.<br />
              Composez votre code PIN Mobile Money pour confirmer.
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 20 }}>
              La confirmation est automatique. Cette page se met à jour dès que le paiement est reçu.
            </div>
            <button className="btn btn-secondary" onClick={onClose}>Fermer</button>
          </div>
        )}

        {step === 'error' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 14, color: 'var(--danger)', marginBottom: 16 }}>{error}</div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-secondary" onClick={onClose} style={{ flex: 1 }}>Annuler</button>
              <button className="btn btn-primary" onClick={() => setStep('form')} style={{ flex: 1 }}>
                <RiRefreshLine size={14} /> Réessayer
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Campaign Detail Modal (gestionnaire) ──────────────────────────────────────
function CampaignDetailModal({
  campaign, payments, accent, isManager, onClose, onClosed,
}: {
  campaign: CotisationCampaign; payments: CotisationPayment[];
  accent: string; isManager: boolean; onClose: () => void; onClosed: () => void;
}) {
  const [closing, setClosing] = useState(false);

  const handleClose = async () => {
    setClosing(true);
    try {
      await cotisationApi.closeCampaign(campaign.id);
      onClosed();
    } catch {}
    finally { setClosing(false); }
  };

  const confirmed = payments.filter(p => p.status === 'CONFIRMED');
  const pending   = payments.filter(p => p.status !== 'CONFIRMED');

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div className="card" style={{ width: '100%', maxWidth: 680, maxHeight: '90vh', overflowY: 'auto', padding: 32 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>{campaign.title}</h2>
            <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
              {confirmed.length}/{payments.length} membres ont cotisé · {formatFCFA(campaign.total_collected_fcfa)} collectés
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {isManager && campaign.status === 'OPEN' && (
              <button className="btn btn-danger btn-sm" onClick={handleClose} disabled={closing}>
                {closing ? '...' : 'Clôturer'}
              </button>
            )}
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
              <RiCloseLine size={20} />
            </button>
          </div>
        </div>

        {/* Tableau des paiements */}
        {payments.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 32, color: 'var(--text-muted)' }}>Aucun paiement initié.</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr><th>Membre</th><th>Montant</th><th>Opérateur</th><th>Statut</th><th>Blockchain</th><th>Date</th></tr>
              </thead>
              <tbody>
                {payments.map(p => (
                  <tr key={p.id}>
                    <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{p.member_name}</td>
                    <td style={{ fontWeight: 600, color: 'var(--success)' }}>{formatFCFA(p.amount_fcfa)}</td>
                    <td>
                      <span style={{ fontSize: 12, fontWeight: 500, color: p.operator === 'togocel' ? '#e53e3e' : '#3182ce' }}>
                        {p.operator === 'togocel' ? 'T-Money' : 'Flooz'}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${p.status === 'CONFIRMED' ? 'badge-success' : p.status === 'FAILED' ? 'badge-danger' : 'badge-warning'}`} style={{ fontSize: 11 }}>
                        {{ CONFIRMED: 'Payé', FAILED: 'Échoué', WAITING_CONFIRMATION: 'En attente', PENDING: 'Non initié' }[p.status] ?? p.status}
                      </span>
                    </td>
                    <td><BlockchainStatus status={p.blockchain_status} /></td>
                    <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                      {p.confirmed_at ? formatDate(p.confirmed_at) : p.initiated_at ? formatDate(p.initiated_at) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}