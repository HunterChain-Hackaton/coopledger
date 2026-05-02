import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { TxType, VoteStatus, Role } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatFCFA(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateStr: string, opts?: Intl.DateTimeFormatOptions): string {
  return new Date(dateStr).toLocaleDateString('fr-FR', opts || {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

export function formatDatetime(dateStr: string): string {
  return new Date(dateStr).toLocaleString('fr-FR', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "à l'instant";
  if (mins < 60) return `il y a ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `il y a ${hours}h`;
  const days = Math.floor(hours / 24);
  return `il y a ${days}j`;
}

export const TX_TYPE_LABELS: Record<TxType, string> = {
  COTISATION: 'Cotisation',
  ACHAT_INTRANT: "Achat d'intrant",
  PRIME_DISTRIBUTION: 'Prime distribuée',
  DEPENSE_ADMIN: 'Dépense admin.',
  AUTRE: 'Autre',
};

export const TX_TYPE_COLORS: Record<TxType, string> = {
  COTISATION: '#10b981',
  ACHAT_INTRANT: '#f59e0b',
  PRIME_DISTRIBUTION: '#3b82f6',
  DEPENSE_ADMIN: '#8b5cf6',
  AUTRE: '#6b7280',
};

export const ROLE_LABELS: Record<Role, string> = {
  PRESIDENT: 'Président',
  TREASURER: 'Trésorier',
  MEMBER: 'Membre',
  AUDITOR: 'Auditeur externe',
  MINISTRY: "Ministère",
  ADMIN: 'Admin système',
};

export const VOTE_STATUS_LABELS: Record<VoteStatus, string> = {
  OPEN: 'En cours',
  CLOSED: 'Clôturé',
  CANCELLED: 'Annulé',
};

export function shortenHash(hash?: string): string {
  if (!hash) return '—';
  return `${hash.slice(0, 8)}...${hash.slice(-6)}`;
}

export function polygonscanUrl(hash: string): string {
  return `https://amoy.polygonscan.com/${hash}`;
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function canManage(role: Role): boolean {
  return ['PRESIDENT', 'TREASURER', 'ADMIN'].includes(role);
}

export function isReadOnly(role: Role): boolean {
  return ['AUDITOR', 'MINISTRY'].includes(role);
}
