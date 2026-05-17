'use client';

import { ReactNode, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

// ─── BUTTON ───
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: ReactNode;
  children?: ReactNode;
}
export function Button({ variant = 'primary', size = 'md', loading, icon, children, className, disabled, ...props }: ButtonProps) {
  const cls = cn(
    'btn',
    `btn-${variant}`,
    size === 'xs' ? 'btn-xs' : size === 'sm' ? 'btn-sm' : size === 'lg' ? 'btn-lg' : '',
    className
  );
  return (
    <button className={cls} disabled={disabled || loading} {...props}>
      {loading ? <span className="spinner" style={{ width: 16, height: 16 }} /> : icon}
      {children}
    </button>
  );
}

// ─── BADGE ───
interface BadgeProps { variant?: 'success' | 'danger' | 'warning' | 'info' | 'muted' | 'accent'; children: ReactNode; className?: string; }
export function Badge({ variant = 'muted', children, className }: BadgeProps) {
  return <span className={cn('badge', `badge-${variant}`, className)}>{children}</span>;
}

// ─── SPINNER ───
export function Spinner({ size = 18 }: { size?: number }) {
  return <span className="spinner" style={{ width: size, height: size }} />;
}

// ─── AVATAR ───
interface AvatarProps { name: string; size?: number; className?: string; }
export function Avatar({ name, size = 36, className }: AvatarProps) {
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  const colors = ['#f07a2a', '#059669', '#2563eb', '#7c3aed', '#dc2626', '#0891b2'];
  const color = colors[name.charCodeAt(0) % colors.length];
  return (
    <div
      className={cn('flex items-center justify-center rounded-full font-semibold text-white flex-shrink-0', className)}
      style={{ width: size, height: size, fontSize: size * 0.35, background: color }}
    >
      {initials}
    </div>
  );
}

// ─── MODAL ───
interface ModalProps { open: boolean; onClose: () => void; title?: string; children: ReactNode; maxWidth?: number; }
export function Modal({ open, onClose, title, children, maxWidth = 520 }: ModalProps) {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;
  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth }}>
        {title && (
          <div className="flex items-center justify-between p-6 pb-0">
            <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)' }}>{title}</h2>
            <button className="btn btn-ghost btn-xs" onClick={onClose}><X size={16} /></button>
          </div>
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

// ─── TOAST ───
interface ToastData { id: string; message: string; type: 'success' | 'error' | 'info'; }
let toastEmitter: ((t: ToastData) => void) | null = null;

export function showToast(message: string, type: ToastData['type'] = 'info') {
  toastEmitter?.({ id: Math.random().toString(36), message, type });
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastData[]>([]);
  useEffect(() => {
    toastEmitter = (t) => {
      setToasts(prev => [...prev, t]);
      setTimeout(() => setToasts(prev => prev.filter(x => x.id !== t.id)), 3500);
    };
    return () => { toastEmitter = null; };
  }, []);

  const icons = { success: '✓', error: '✕', info: 'ℹ' };
  const colors = { success: 'var(--success)', error: 'var(--danger)', info: 'var(--info)' };

  return (
    <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 100, display: 'flex', flexDirection: 'column', gap: 8 }}>
      {toasts.map(t => (
        <div key={t.id} className={`toast ${t.type}`}>
          <span style={{ color: colors[t.type], fontWeight: 700, fontSize: 16 }}>{icons[t.type]}</span>
          <span style={{ color: 'var(--text-primary)', fontSize: 14 }}>{t.message}</span>
        </div>
      ))}
    </div>
  );
}

// ─── EMPTY STATE ───
interface EmptyProps { icon?: ReactNode; title: string; description?: string; action?: ReactNode; }
export function EmptyState({ icon, title, description, action }: EmptyProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
      {icon && <div style={{ color: 'var(--text-muted)', fontSize: 40 }}>{icon}</div>}
      <div>
        <p style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>{title}</p>
        {description && <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{description}</p>}
      </div>
      {action}
    </div>
  );
}

// ─── SECTION HEADER ───
export function SectionHeader({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 mb-6">
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'Sora, sans-serif' }}>{title}</h1>
        {description && <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 4 }}>{description}</p>}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}

// ─── STAT CARD ───
interface StatCardProps { label: string; value: string; delta?: string; deltaUp?: boolean; icon?: ReactNode; accent?: boolean; }
export function StatCard({ label, value, delta, deltaUp, icon, accent }: StatCardProps) {
  return (
    <div className="stat-card" style={accent ? { borderColor: 'var(--border-strong)', background: 'var(--accent-subtle)' } : {}}>
      <div className="flex items-center justify-between">
        <span className="stat-label">{label}</span>
        {icon && <span style={{ color: 'var(--accent)', opacity: 0.7 }}>{icon}</span>}
      </div>
      <div className="stat-value">{value}</div>
      {delta && (
        <div className={`stat-delta ${deltaUp ? 'up' : 'down'}`}>
          <span>{deltaUp ? '▲' : '▼'}</span>
          <span>{delta}</span>
        </div>
      )}
    </div>
  );
}

// ─── HASH DISPLAY ───
export function HashDisplay({ hash, url }: { hash?: string; url?: string }) {
  if (!hash) return <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>—</span>;
  const short = `${hash.slice(0, 8)}...${hash.slice(-6)}`;
  const content = (
    <span className="font-mono" style={{ fontSize: 11, color: 'var(--info)', letterSpacing: '0.03em' }}>{short}</span>
  );
  if (url) {
    return <a href={url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>{content}</a>;
  }
  return content;
}

export interface statusBlockChain {
  status: 'PENDING' | 'CONFIRMED' | 'FAILED'
}

// ─── BLOCKCHAIN STATUS ───
export function BlockchainStatus({ status }: statusBlockChain) {
  if (status === 'CONFIRMED') return (
    <div className="flex items-center gap-2">
      <span className="chain-dot chain-confirmed" />
      <span style={{ fontSize: 12, color: 'var(--success)' }}>Confirmé</span>
    </div>
  );
  if (status === 'PENDING') return (
    <div className="flex items-center gap-2">
      <span className="chain-dot chain-pending" style={{ animation: 'none', background: 'var(--warning)' }} />
      <span style={{ fontSize: 12, color: 'var(--warning)' }}>En attente</span>
    </div>
  );
  return (
    <div className="flex items-center gap-2">
      <span className="chain-dot chain-failed" />
      <span style={{ fontSize: 12, color: 'var(--danger)' }}>Échec</span>
    </div>
  );
}
