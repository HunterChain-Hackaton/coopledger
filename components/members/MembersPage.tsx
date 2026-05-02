'use client';

import { useEffect, useState, useCallback } from 'react';
import { UserPlus, Search, UserX, UserCheck, Phone } from 'lucide-react';
import { RiUserLine, RiShieldCheckLine } from 'react-icons/ri';
import { memberApi } from '@/lib/api';
import { CooperativeMember, Role } from '@/types';
import { Avatar, Button, Badge, Modal, EmptyState, SectionHeader, showToast } from '@/components/ui';
import { formatDate, ROLE_LABELS } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useTheme } from '@/hooks/useTheme';

const DEMO_MEMBERS: CooperativeMember[] = [
  { id: 1, phone_number: '+22890112233', full_name: 'Kofi Agbemadon', cooperative: 1, cooperative_name: 'CAK', role: 'PRESIDENT', is_active: true, joined_at: '2024-01-15', votes_participated: 12, created_at: '2024-01-15T00:00:00Z' },
  { id: 2, phone_number: '+22891223344', full_name: 'Ama Dossou', cooperative: 1, cooperative_name: 'CAK', role: 'TREASURER', is_active: true, joined_at: '2024-01-15', votes_participated: 11, created_at: '2024-01-15T00:00:00Z' },
  { id: 3, phone_number: '+22892334455', full_name: 'Kofi Mensah', cooperative: 1, cooperative_name: 'CAK', role: 'MEMBER', is_active: true, joined_at: '2024-02-10', votes_participated: 9, created_at: '2024-02-10T00:00:00Z' },
  { id: 4, phone_number: '+22893445566', full_name: 'Abla Koffi', cooperative: 1, cooperative_name: 'CAK', role: 'MEMBER', is_active: true, joined_at: '2024-02-15', votes_participated: 10, created_at: '2024-02-15T00:00:00Z' },
  { id: 5, phone_number: '+22894556677', full_name: 'Afi Sossou', cooperative: 1, cooperative_name: 'CAK', role: 'MEMBER', is_active: true, joined_at: '2024-03-01', votes_participated: 8, created_at: '2024-03-01T00:00:00Z' },
  { id: 6, phone_number: '+22895667788', full_name: 'Yao Tetevi', cooperative: 1, cooperative_name: 'CAK', role: 'MEMBER', is_active: true, joined_at: '2024-03-20', votes_participated: 7, created_at: '2024-03-20T00:00:00Z' },
  { id: 7, phone_number: '+22896778899', full_name: 'Mawuli Dodzi', cooperative: 1, cooperative_name: 'CAK', role: 'MEMBER', is_active: true, joined_at: '2024-04-05', votes_participated: 6, created_at: '2024-04-05T00:00:00Z' },
  { id: 8, phone_number: '+22897889900', full_name: 'Sena Amedro', cooperative: 1, cooperative_name: 'CAK', role: 'MEMBER', is_active: false, joined_at: '2024-04-10', votes_participated: 2, created_at: '2024-04-10T00:00:00Z' },
  { id: 9, phone_number: '+22898990011', full_name: 'Kosi Ekpè', cooperative: 1, cooperative_name: 'CAK', role: 'MEMBER', is_active: true, joined_at: '2024-05-01', votes_participated: 5, created_at: '2024-05-01T00:00:00Z' },
  { id: 10, phone_number: '+22899001122', full_name: 'Dzifa Ameko', cooperative: 1, cooperative_name: 'CAK', role: 'AUDITOR', is_active: true, joined_at: '2024-06-01', votes_participated: 0, created_at: '2024-06-01T00:00:00Z' },
  { id: 11, phone_number: '+22890112244', full_name: 'Gafari Asamoah', cooperative: 1, cooperative_name: 'CAK', role: 'MEMBER', is_active: true, joined_at: '2024-07-15', votes_participated: 4, created_at: '2024-07-15T00:00:00Z' },
  { id: 12, phone_number: '+22891223355', full_name: 'Efua Tagoe', cooperative: 1, cooperative_name: 'CAK', role: 'MEMBER', is_active: true, joined_at: '2024-08-01', votes_participated: 3, created_at: '2024-08-01T00:00:00Z' },
];

const ROLE_BADGE: Record<Role, 'success' | 'warning' | 'info' | 'muted' | 'accent' | 'danger'> = {
  PRESIDENT: 'warning',
  TREASURER: 'accent',
  MEMBER: 'muted',
  AUDITOR: 'info',
  MINISTRY: 'info',
  ADMIN: 'danger',
};

// ─── ADD MEMBER MODAL ───
function AddMemberModal({ open, onClose, onAdded }: { open: boolean; onClose: () => void; onAdded: () => void }) {
  const [form, setForm] = useState({ phone_number: '', full_name: '', role: 'MEMBER' as Role, national_id: '' });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await memberApi.create(form);
      showToast('Membre ajouté · invitation SMS envoyée', 'success');
      onAdded();
      onClose();
      setForm({ phone_number: '', full_name: '', role: 'MEMBER', national_id: '' });
    } catch {
      showToast('Erreur lors de l\'ajout du membre', 'error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Ajouter un membre">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="input-label">Nom complet</label>
          <input type="text" className="input" placeholder="Kofi Mensah" value={form.full_name} onChange={(e) => setForm(f => ({ ...f, full_name: e.target.value }))} required />
        </div>
        <div>
          <label className="input-label">Numéro de téléphone</label>
          <div style={{ position: 'relative' }}>
            <Phone size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input type="tel" className="input" style={{ paddingLeft: 36 }} placeholder="+228 90 00 00 00" value={form.phone_number} onChange={(e) => setForm(f => ({ ...f, phone_number: e.target.value }))} required />
          </div>
        </div>
        <div>
          <label className="input-label">Rôle</label>
          <select className="input" value={form.role} onChange={(e) => setForm(f => ({ ...f, role: e.target.value as Role }))}>
            {(['MEMBER', 'TREASURER', 'AUDITOR'] as Role[]).map(r => (
              <option key={r} value={r}>{ROLE_LABELS[r]}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="input-label">N° pièce d'identité (optionnel)</label>
          <input type="text" className="input" placeholder="CNI-0000000" value={form.national_id} onChange={(e) => setForm(f => ({ ...f, national_id: e.target.value }))} />
        </div>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', padding: '8px 12px', background: 'var(--info-bg)', borderRadius: 8 }}>
          Un SMS d'invitation sera envoyé automatiquement au numéro renseigné. Un wallet Polygon sera créé pour ce membre.
        </p>
        <div className="flex gap-3 mt-2">
          <Button variant="secondary" type="button" onClick={onClose} style={{ flex: 1 }}>Annuler</Button>
          <Button type="submit" loading={loading} icon={<UserPlus size={15} />} style={{ flex: 1 }}>Ajouter</Button>
        </div>
      </form>
    </Modal>
  );
}

// ─── MEMBER DETAIL MODAL ───
function MemberDetailModal({ member, open, onClose, onUpdate }: { member: CooperativeMember | null; open: boolean; onClose: () => void; onUpdate: () => void }) {
  const [loading, setLoading] = useState(false);
  if (!member) return null;

  async function handleToggle() {
    if (!member) return ;
    setLoading(true);
    try {
      await memberApi.update(member.id, { is_active: !member.is_active });
      showToast(member.is_active ? 'Membre désactivé' : 'Membre réactivé', 'info');
      onUpdate();
      onClose();
    } catch {
      showToast('Erreur lors de la mise à jour', 'error');
    } finally {
      setLoading(false);
    }
  }

  const totalVotes = 12; // Would come from API
  const participation = totalVotes > 0 ? Math.round((member.votes_participated / totalVotes) * 100) : 0;

  return (
    <Modal open={open} onClose={onClose} title="Détail membre">
      <div className="flex flex-col gap-5">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Avatar name={member.full_name} size={52} />
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>{member.full_name}</div>
            <Badge variant={ROLE_BADGE[member.role]} className="mt-1">{ROLE_LABELS[member.role]}</Badge>
          </div>
        </div>

        {/* Info grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {[
            ['Téléphone', member.phone_number],
            ['Membre depuis', formatDate(member.joined_at)],
            ['Statut', member.is_active ? 'Actif' : 'Inactif'],
            ['Dernière connexion', member.last_login_at ? formatDate(member.last_login_at) : '—'],
          ].map(([k, v]) => (
            <div key={k}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>{k}</div>
              <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>{v}</div>
            </div>
          ))}
        </div>

        {/* Participation */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 13 }}>
            <span style={{ color: 'var(--text-secondary)' }}>Participation aux votes</span>
            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{member.votes_participated}/{totalVotes} ({participation}%)</span>
          </div>
          <div className="progress">
            <div className="progress-bar accent" style={{ width: `${participation}%`, background: participation > 60 ? 'var(--success)' : participation > 30 ? 'var(--warning)' : 'var(--danger)' }} />
          </div>
        </div>

        {/* Wallet */}
        <div style={{ background: 'var(--accent-subtle)', borderRadius: 8, padding: 12 }}>
          <div className="flex items-center gap-2" style={{ fontSize: 13 }}>
            <RiShieldCheckLine size={14} style={{ color: 'var(--accent)' }} />
            <span style={{ color: 'var(--text-secondary)' }}>Wallet Polygon géré par CoopLedger</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-1">
          <Button variant="secondary" onClick={onClose} style={{ flex: 1 }}>Fermer</Button>
          <Button
            variant={member.is_active ? 'danger' : 'secondary'}
            loading={loading}
            icon={member.is_active ? <UserX size={15} /> : <UserCheck size={15} />}
            onClick={handleToggle}
            style={{ flex: 1 }}
          >
            {member.is_active ? 'Désactiver' : 'Réactiver'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

// ─── MAIN PAGE ───
export default function MembersPage() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [members, setMembers] = useState<CooperativeMember[]>(DEMO_MEMBERS);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<Role | ''>('');
  const [addOpen, setAddOpen] = useState(false);
  const [selected, setSelected] = useState<CooperativeMember | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const accentColor = theme === 'dry' ? '#f07a2a' : '#059669';

  const loadMembers = useCallback(async () => {
    try {
      const { data } = await memberApi.list();
      setMembers(data.results || data);
    } catch { /* use demo */ }
  }, []);

  useEffect(() => { loadMembers(); }, [loadMembers]);

  const filtered = members.filter((m) => {
    if (roleFilter && m.role !== roleFilter) return false;
    if (search && !m.full_name.toLowerCase().includes(search.toLowerCase()) && !m.phone_number.includes(search)) return false;
    return true;
  });

  const activeCount = members.filter(m => m.is_active).length;
  const totalVotes = 12; // From API

  // Engagement chart data
  const engagementData = members.filter(m => m.is_active && m.role === 'MEMBER').slice(0, 8).map(m => ({
    name: m.full_name.split(' ')[0],
    votes: m.votes_participated,
    pct: Math.round((m.votes_participated / totalVotes) * 100),
  }));

  return (
    <div>
      <SectionHeader
        title="Gestion des membres"
        description={`${activeCount} membres actifs · Coopérative Agricole de Kpalimé`}
        action={
          <Button size="sm" icon={<UserPlus size={15} />} onClick={() => setAddOpen(true)}>
            Ajouter un membre
          </Button>
        }
      />

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Membres actifs', value: activeCount, color: 'var(--success)' },
          { label: 'Membres inactifs', value: members.length - activeCount, color: 'var(--danger)' },
          { label: 'Quorum (51%)', value: Math.ceil(activeCount * 0.51), color: 'var(--warning)' },
          { label: 'Taux moyen participation', value: `${Math.round(members.reduce((s, m) => s + m.votes_participated, 0) / (activeCount * totalVotes) * 100)}%`, color: accentColor },
        ].map((s) => (
          <div key={s.label} className="card p-5">
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6 }}>{s.label}</div>
            <div style={{ fontSize: 26, fontWeight: 700, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Engagement chart */}
      <div className="card p-5 mb-6">
        <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>Participation aux votes par membre</p>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16 }}>{totalVotes} votes organisés · Membres actifs uniquement</p>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={engagementData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
            <XAxis dataKey="name" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip formatter={(v: number) => [`${v} votes`, 'Participation']} contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-strong)', borderRadius: 8, fontSize: 12 }} />
            <Bar dataKey="votes" fill={accentColor} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Filters */}
      <div className="card mb-4">
        <div className="flex flex-wrap gap-3 p-4">
          <div style={{ position: 'relative', flex: '1 1 200px' }}>
            <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input type="text" className="input" style={{ paddingLeft: 36 }} placeholder="Rechercher..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <select className="input" style={{ flex: '0 1 160px' }} value={roleFilter} onChange={(e) => setRoleFilter(e.target.value as Role | '')}>
            <option value="">Tous les rôles</option>
            {(Object.entries(ROLE_LABELS) as [Role, string][]).map(([v, l]) => (
              <option key={v} value={v}>{l}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Members grid */}
      {filtered.length === 0 ? (
        <div className="card">
          <EmptyState icon={<RiUserLine />} title="Aucun membre" description="Ajoutez votre premier membre à la coopérative." action={<Button size="sm" onClick={() => setAddOpen(true)}>Ajouter un membre</Button>} />
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
          {filtered.map((member) => {
            const participation = totalVotes > 0 ? Math.round((member.votes_participated / totalVotes) * 100) : 0;
            return (
              <div
                key={member.id}
                className="card card-glow"
                style={{ padding: 16, cursor: 'pointer', opacity: member.is_active ? 1 : 0.6 }}
                onClick={() => { setSelected(member); setDetailOpen(true); }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <Avatar name={member.full_name} size={40} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {member.full_name}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{member.phone_number}</div>
                  </div>
                  <Badge variant={ROLE_BADGE[member.role]} className="flex-shrink-0 text-[10px]">
                    {ROLE_LABELS[member.role]}
                  </Badge>
                </div>

                {/* Participation bar */}
                <div>
                  <div className="flex justify-between mb-1" style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                    <span>Participation</span>
                    <span style={{ fontWeight: 600 }}>{participation}%</span>
                  </div>
                  <div className="progress" style={{ height: 4 }}>
                    <div className="progress-bar" style={{
                      width: `${participation}%`,
                      background: participation > 60 ? 'var(--success)' : participation > 30 ? 'var(--warning)' : 'var(--danger)'
                    }} />
                  </div>
                </div>

                <div className="flex items-center justify-between mt-2" style={{ fontSize: 11 }}>
                  <span style={{ color: 'var(--text-muted)' }}>Depuis {formatDate(member.joined_at, { month: 'short', year: 'numeric' })}</span>
                  {!member.is_active && <span className="badge badge-danger" style={{ fontSize: 10 }}>Inactif</span>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <AddMemberModal open={addOpen} onClose={() => setAddOpen(false)} onAdded={loadMembers} />
      <MemberDetailModal member={selected} open={detailOpen} onClose={() => setDetailOpen(false)} onUpdate={loadMembers} />
    </div>
  );
}
