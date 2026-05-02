'use client';

import { useState } from 'react';
import { FileText, Download, ExternalLink, Plus } from 'lucide-react';
import { RiShieldCheckLine } from 'react-icons/ri';
import { Button, SectionHeader, HashDisplay, showToast } from '@/components/ui';
import { formatDate, formatFCFA } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { canManage } from '@/lib/utils';

const DEMO_REPORTS = [
  { id: 3, period_start: '2026-04-01', period_end: '2026-04-30', opening_balance: 1075000, total_in: 460000, total_out: 250000, closing_balance: 1285000, polygon_hash: '0xaaa111bbb222ccc333ddd444eee555fff666aaa', created_at: '2026-05-01T00:00:00Z' },
  { id: 2, period_start: '2026-03-01', period_end: '2026-03-31', opening_balance: 865000, total_in: 510000, total_out: 300000, closing_balance: 1075000, polygon_hash: '0xbbb222ccc333ddd444eee555fff666aaa111bbb', created_at: '2026-04-01T00:00:00Z' },
  { id: 1, period_start: '2026-02-01', period_end: '2026-02-28', opening_balance: 705000, total_in: 380000, total_out: 220000, closing_balance: 865000, polygon_hash: '0xccc333ddd444eee555fff666aaa111bbb222ccc', created_at: '2026-03-01T00:00:00Z' },
];

export default function ReportsPage() {
  const { user } = useAuth();
  const [generating, setGenerating] = useState(false);
  const canGen = user?.role ? canManage(user.role) : false;

  async function handleGenerate() {
    setGenerating(true);
    setTimeout(() => {
      showToast('Rapport généré et certifié sur Polygon', 'success');
      setGenerating(false);
    }, 1500);
  }

  return (
    <div>
      <SectionHeader
        title="Rapports mensuels"
        description="Rapports financiers certifiés — hash PDF ancré sur la blockchain Polygon."
        action={canGen && (
          <Button size="sm" icon={<Plus size={15} />} onClick={handleGenerate} loading={generating}>
            Générer rapport
          </Button>
        )}
      />

      <div className="flex flex-col gap-4">
        {DEMO_REPORTS.map((report) => (
          <div key={report.id} className="card p-6">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-4">
                <div style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--accent-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <FileText size={22} style={{ color: 'var(--accent)' }} />
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>
                    Rapport — {formatDate(report.period_start, { month: 'long', year: 'numeric' })}
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                    {formatDate(report.period_start)} → {formatDate(report.period_end)}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm" icon={<Download size={14} />} onClick={() => showToast('Téléchargement non disponible en démo', 'info')}>
                  PDF
                </Button>
              </div>
            </div>

            {/* Financials */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
              {[
                { label: 'Solde ouverture', value: formatFCFA(report.opening_balance), color: 'var(--text-primary)' },
                { label: 'Total entrées', value: `+${formatFCFA(report.total_in)}`, color: 'var(--success)' },
                { label: 'Total sorties', value: `-${formatFCFA(report.total_out)}`, color: 'var(--danger)' },
                { label: 'Solde clôture', value: formatFCFA(report.closing_balance), color: 'var(--accent)' },
              ].map((s) => (
                <div key={s.label} style={{ background: 'var(--bg-secondary)', borderRadius: 8, padding: '12px 14px' }}>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>{s.label}</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: s.color }}>{s.value}</div>
                </div>
              ))}
            </div>

            {/* Blockchain cert */}
            <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
              <div className="flex items-center gap-2" style={{ fontSize: 12 }}>
                <RiShieldCheckLine size={14} style={{ color: 'var(--success)' }} />
                <span style={{ color: 'var(--text-secondary)' }}>Certifié sur Polygon ·</span>
                <HashDisplay hash={report.polygon_hash} url={`https://polygon-amoy.g.alchemy.com/v2/${report.polygon_hash}`} />
              </div>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Généré le {formatDate(report.created_at)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
