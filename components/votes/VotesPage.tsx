'use client';

import { useEffect, useState, useCallback } from 'react';
import { Plus, ExternalLink, Clock, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import { RiVipCrown2Line } from 'react-icons/ri';
import { voteApi } from '@/lib/api';
import { CooperativeVote } from '@/types';
import { Button, Badge, Modal, EmptyState, SectionHeader, HashDisplay, showToast } from '@/components/ui';
import { formatDate, formatDatetime, formatFCFA, canManage } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';

const DEMO_VOTES: CooperativeVote[] = [
  { id: 1, cooperative: 1, created_by: 1, created_by_name: 'Kofi Agbemadon', title: 'Achat tracteur collectif — 2 500 000 FCFA', description: "Proposition d'acquisition d'un tracteur agricole collectif pour améliorer les rendements de récolte 2026. Le tracteur serait partagé entre les 12 membres actifs selon un planning mensuel.", description_hash: 'abc123def456', threshold_amount_fcfa: 2500000, deadline: '2026-05-10T23:59:00Z', quorum_required: 7, status: 'OPEN', votes_for: 4, votes_against: 1, quorum_reached: false, passed: false, create_tx_hash: '0x1111aaaa2222bbbb3333cccc4444dddd5555eeee', created_at: '2026-04-28T08:00:00Z', total_votes: 5 },
  { id: 2, cooperative: 1, created_by: 1, created_by_name: 'Ama Dossou', title: 'Renouvellement contrat semences certifiées', description: "Reconduction du partenariat avec le fournisseur de semences certifiées AGRI-TOGO pour la saison 2026-2027. Montant estimé : 350 000 FCFA.", description_hash: 'def456ghi789', threshold_amount_fcfa: 350000, deadline: '2026-04-20T23:59:00Z', quorum_required: 7, status: 'CLOSED', votes_for: 8, votes_against: 2, quorum_reached: true, passed: true, create_tx_hash: '0x2222bbbb3333cccc4444dddd5555eeee6666ffff', close_tx_hash: '0x3333cccc4444dddd5555eeee6666ffff7777aaaa', created_at: '2026-04-10T08:00:00Z', closed_at: '2026-04-20T23:59:00Z', total_votes: 10 },
  { id: 3, cooperative: 1, created_by: 1, created_by_name: 'Kofi Agbemadon', title: "Fonds d'urgence sécheresse — 500 000 FCFA", description: "Constitution d'un fonds d'urgence pour faire face aux pertes liées à la sécheresse de début 2026. Prélèvement sur le solde actuel.", description_hash: 'ghi789jkl012', threshold_amount_fcfa: 500000, deadline: '2026-03-15T23:59:00Z', quorum_required: 7, status: 'CLOSED', votes_for: 5, votes_against: 6, quorum_reached: true, passed: false, create_tx_hash: '0x4444dddd5555eeee6666ffff7777aaaa8888bbbb', close_tx_hash: '0x5555eeee6666ffff7777aaaa8888bbbb9999cccc', created_at: '2026-03-05T08:00:00Z', closed_at: '2026-03-15T23:59:00Z', total_votes: 11 },
];

function VoteStatusBadge({ vote }: { vote: CooperativeVote }) {
  if (vote.status === 'OPEN') return <Badge variant="accent">En cours</Badge>;
  if (vote.status === 'CANCELLED') return <Badge variant="muted">Annulé</Badge>;
  if (vote.passed) return <Badge variant="success">Adopté</Badge>;
  return <Badge variant="danger">Rejeté</Badge>;
}

// ─── CREATE VOTE MODAL ───
function CreateVoteModal({ open, onClose, onCreated }: { open: boolean; onClose: () => void; onCreated: () => void }) {
  const [form, setForm] = useState({ title: '', description: '', threshold_amount_fcfa: '', quorum_required: '7', deadline: '' });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.deadline) { showToast('Date limite obligatoire', 'error'); return; }
    setLoading(true);
    try {
      await voteApi.create({ ...form, threshold_amount_fcfa: Number(form.threshold_amount_fcfa), quorum_required: Number(form.quorum_required) });
      showToast('Vote créé et enregistré sur Polygon', 'success');
      onCreated(); onClose();
    } catch { showToast('Erreur lors de la création', 'error'); }
    finally { setLoading(false); }
  }

  return (
    <Modal open={open} onClose={onClose} title="Créer un vote">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div><label className="input-label">Titre de la résolution</label><input type="text" className="input" placeholder="Ex: Achat matériel agricole" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required /></div>
        <div><label className="input-label">Description détaillée</label><textarea className="input" rows={4} placeholder="Décrivez la résolution en détail..." value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} style={{ resize: 'vertical' }} required /></div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="input-label">Seuil financier (FCFA)</label><input type="number" className="input" placeholder="500000" value={form.threshold_amount_fcfa} onChange={e => setForm(f => ({ ...f, threshold_amount_fcfa: e.target.value }))} min={0} required /></div>
          <div><label className="input-label">Quorum (membres)</label><input type="number" className="input" placeholder="7" value={form.quorum_required} onChange={e => setForm(f => ({ ...f, quorum_required: e.target.value }))} min={1} required /></div>
        </div>
        <div><label className="input-label">Date limite</label><input type="datetime-local" className="input" value={form.deadline} onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))} required /></div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', padding: '8px 12px', background: 'var(--info-bg)', borderRadius: 8 }}>
          La création sera enregistrée sur la blockchain Polygon. Une notification push sera envoyée à tous les membres.
        </div>
        <div className="flex gap-3 mt-2">
          <Button variant="secondary" type="button" onClick={onClose} style={{ flex: 1 }}>Annuler</Button>
          <Button type="submit" loading={loading} style={{ flex: 1 }}>Créer le vote</Button>
        </div>
      </form>
    </Modal>
  );
}

// ─── VOTE DETAIL MODAL ───
function VoteDetailModal({ vote, open, onClose, onUpdate, canClose }: { vote: CooperativeVote | null; open: boolean; onClose: () => void; onUpdate: () => void; canClose: boolean }) {
  const [voting, setVoting] = useState(false);
  const [closing, setClosing] = useState(false);
  if (!vote) return null;

  const total = vote.votes_for + vote.votes_against;
  const forPct = total > 0 ? Math.round((vote.votes_for / total) * 100) : 0;
  const againstPct = 100 - forPct;
  const quorumPct = Math.round((total / vote.quorum_required) * 100);

  async function handleVote(inFavor: boolean) {
    if (!vote) return ;
    setVoting(true);
    try {
      await voteApi.cast(vote.id, inFavor);
      showToast(`Vote ${inFavor ? 'POUR' : 'CONTRE'} enregistré sur Polygon`, 'success');
      onUpdate(); onClose();
    } catch { showToast('Erreur ou vote déjà soumis', 'error'); }
    finally { setVoting(false); }
  }

  async function handleClose() {
    if (!vote) return ;
    setClosing(true);
    try {
      await voteApi.close(vote.id);
      showToast('Vote clôturé et résultat enregistré sur Polygon', 'success');
      onUpdate(); onClose();
    } catch { showToast('Erreur lors de la clôture', 'error'); }
    finally { setClosing(false); }
  }

  return (
    <Modal open={open} onClose={onClose} title="Détail du vote" maxWidth={580}>
      <div className="flex flex-col gap-5">
        <div className="flex items-start justify-between gap-3">
          <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.4 }}>{vote.title}</h3>
          <VoteStatusBadge vote={vote} />
        </div>

        <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{vote.description}</p>

        <div className="grid grid-cols-2 gap-3" style={{ fontSize: 13 }}>
          {[
            ['Seuil financier', formatFCFA(vote.threshold_amount_fcfa)],
            ['Quorum requis', `${vote.quorum_required} membres`],
            ['Créé par', vote.created_by_name || '—'],
            ['Deadline', formatDatetime(vote.deadline)],
          ].map(([k, v]) => (
            <div key={k}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>{k}</div>
              <div style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{v}</div>
            </div>
          ))}
        </div>

        {/* Results */}
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 12 }}>RÉSULTATS</div>
          <div className="flex gap-4 mb-4">
            <div style={{ flex: 1, textAlign: 'center', padding: '12px', background: 'var(--success-bg)', borderRadius: 8 }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--success)' }}>{vote.votes_for}</div>
              <div style={{ fontSize: 12, color: 'var(--success)' }}>POUR ({forPct}%)</div>
            </div>
            <div style={{ flex: 1, textAlign: 'center', padding: '12px', background: 'var(--danger-bg)', borderRadius: 8 }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--danger)' }}>{vote.votes_against}</div>
              <div style={{ fontSize: 12, color: 'var(--danger)' }}>CONTRE ({againstPct}%)</div>
            </div>
          </div>

          {/* Progress */}
          <div style={{ height: 10, background: 'var(--border-subtle)', borderRadius: 5, overflow: 'hidden', marginBottom: 8 }}>
            <div style={{ height: '100%', width: `${forPct}%`, background: 'var(--success)', borderRadius: 5, transition: 'width 0.5s' }} />
          </div>

          {/* Quorum */}
          <div className="flex items-center justify-between" style={{ fontSize: 12 }}>
            <span style={{ color: 'var(--text-muted)' }}>Quorum : {total}/{vote.quorum_required} ({quorumPct}%)</span>
            {vote.quorum_reached
              ? <span style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', gap: 4 }}><CheckCircle2 size={12} /> Atteint</span>
              : <span style={{ color: 'var(--warning)', display: 'flex', alignItems: 'center', gap: 4 }}><AlertTriangle size={12} /> Non atteint</span>}
          </div>
        </div>

        {/* Blockchain proof */}
        {(vote.create_tx_hash || vote.close_tx_hash) && (
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 10 }}>PREUVE BLOCKCHAIN</div>
            {vote.create_tx_hash && (
              <div className="flex items-center justify-between mb-2" style={{ fontSize: 13 }}>
                <span style={{ color: 'var(--text-secondary)' }}>Création</span>
                <HashDisplay hash={vote.create_tx_hash} url={`https://polygon-amoy.g.alchemy.com/v2/${vote.create_tx_hash}`} />
              </div>
            )}
            {vote.close_tx_hash && (
              <div className="flex items-center justify-between" style={{ fontSize: 13 }}>
                <span style={{ color: 'var(--text-secondary)' }}>Clôture</span>
                <HashDisplay hash={vote.close_tx_hash} url={`https://polygon-amoy.g.alchemy.com/v2/${vote.close_tx_hash}`} />
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        {vote.status === 'OPEN' && (
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16 }}>
            <div className="flex gap-3">
              <Button
                onClick={() => handleVote(false)} loading={voting} variant="danger" style={{ flex: 1 }}
                icon={<XCircle size={15} />}
              >CONTRE</Button>
              <Button
                onClick={() => handleVote(true)} loading={voting} style={{ flex: 1 }}
                icon={<CheckCircle2 size={15} />}
              >POUR</Button>
            </div>
            {canClose && (
              <Button variant="secondary" size="sm" onClick={handleClose} loading={closing} style={{ width: '100%', marginTop: 8 }}>
                Clôturer manuellement
              </Button>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}

// ─── MAIN ───
export default function VotesPage() {
  const { user } = useAuth();
  const [votes, setVotes] = useState<CooperativeVote[]>(DEMO_VOTES);
  const [createOpen, setCreateOpen] = useState(false);
  const [selected, setSelected] = useState<CooperativeVote | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [filter, setFilter] = useState<'ALL' | 'OPEN' | 'CLOSED'>('ALL');

  const canCreate = user?.role ? canManage(user.role) : false;
  const canCloseVote = user?.role ? canManage(user.role) : false;

  const loadVotes = useCallback(async () => {
    try {
      const { data } = await voteApi.list();
      setVotes(data.results || data);
    } catch { /* demo */ }
  }, []);

  useEffect(() => { loadVotes(); }, [loadVotes]);

  const filtered = votes.filter(v => filter === 'ALL' ? true : v.status === filter);
  const open = votes.filter(v => v.status === 'OPEN');

  return (
    <div>
      <SectionHeader
        title="Votes & Gouvernance"
        description="Résolutions enregistrées sur la blockchain Polygon — résultats immuables."
        action={canCreate && (
          <Button size="sm" icon={<Plus size={15} />} onClick={() => setCreateOpen(true)}>
            Nouveau vote
          </Button>
        )}
      />

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Votes en cours', value: votes.filter(v => v.status === 'OPEN').length, color: 'var(--accent)' },
          { label: 'Adoptés', value: votes.filter(v => v.passed).length, color: 'var(--success)' },
          { label: 'Rejetés', value: votes.filter(v => v.status === 'CLOSED' && !v.passed).length, color: 'var(--danger)' },
        ].map(s => (
          <div key={s.label} className="card p-4 text-center">
            <div style={{ fontSize: 28, fontWeight: 700, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-4">
        {(['ALL', 'OPEN', 'CLOSED'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '7px 16px', borderRadius: 20, fontSize: 13, fontWeight: 500,
              border: '1px solid', cursor: 'pointer', fontFamily: 'Sora, sans-serif',
              background: filter === f ? 'var(--accent)' : 'transparent',
              color: filter === f ? 'var(--text-inverse)' : 'var(--text-secondary)',
              borderColor: filter === f ? 'var(--accent)' : 'var(--border)',
            }}
          >
            {f === 'ALL' ? 'Tous' : f === 'OPEN' ? 'En cours' : 'Clôturés'}
          </button>
        ))}
      </div>

      {/* Votes list */}
      {filtered.length === 0 ? (
        <div className="card"><EmptyState icon={<RiVipCrown2Line />} title="Aucun vote" description="Créez votre premier vote pour lancer une résolution." action={canCreate ? <Button size="sm" onClick={() => setCreateOpen(true)}>Nouveau vote</Button> : undefined} /></div>
      ) : (
        <div className="flex flex-col gap-4">
          {filtered.map(vote => {
            const total = vote.votes_for + vote.votes_against;
            const forPct = total > 0 ? Math.round((vote.votes_for / total) * 100) : 0;
            return (
              <div key={vote.id} className="card card-glow p-6 cursor-pointer" onClick={() => { setSelected(vote); setDetailOpen(true); }}>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>{vote.title}</div>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{vote.description}</div>
                  </div>
                  <VoteStatusBadge vote={vote} />
                </div>

                <div style={{ height: 8, background: 'var(--border-subtle)', borderRadius: 4, overflow: 'hidden', marginBottom: 8 }}>
                  <div style={{ width: `${forPct}%`, height: '100%', background: 'var(--success)', borderRadius: 4, transition: 'width 0.5s' }} />
                </div>

                <div className="flex items-center justify-between" style={{ fontSize: 13 }}>
                  <div className="flex items-center gap-4">
                    <span style={{ color: 'var(--success)', fontWeight: 600 }}>{vote.votes_for} POUR</span>
                    <span style={{ color: 'var(--danger)', fontWeight: 600 }}>{vote.votes_against} CONTRE</span>
                    <span style={{ color: 'var(--text-muted)' }}>quorum: {total}/{vote.quorum_required}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {vote.status === 'OPEN' && (
                      <span style={{ fontSize: 12, color: 'var(--warning)', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Clock size={12} /> {formatDate(vote.deadline)}
                      </span>
                    )}
                    {vote.create_tx_hash && (
                      <HashDisplay hash={vote.create_tx_hash} url={`https://polygon-amoy.g.alchemy.com/v2/${vote.create_tx_hash}`} />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <CreateVoteModal open={createOpen} onClose={() => setCreateOpen(false)} onCreated={loadVotes} />
      <VoteDetailModal vote={selected} open={detailOpen} onClose={() => setDetailOpen(false)} onUpdate={loadVotes} canClose={canCloseVote} />
    </div>
  );
}
