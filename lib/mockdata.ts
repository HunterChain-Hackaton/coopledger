// Fallback mockdata — utilisé si le backend ne répond pas
import { PublicCooperative } from '@/types';

export const MOCK_COOPERATIVES: PublicCooperative[] = [
  {
    id: 1, name: 'Coopérative Agricole de Kpalimé', code: 'CAK-001',
    region: 'Plateaux', village: 'Kpalimé', balance_fcfa: 1285000,
    member_count: 12, transaction_count: 34, vote_count: 4,
    is_active: true, created_at: '2025-01-01', polygon_coop_id: 1,
  },
  {
    id: 2, name: 'Union des Producteurs de Cacao de Kpandu', code: 'UPC-002',
    region: 'Plateaux', village: 'Kpandu', balance_fcfa: 870000,
    member_count: 8, transaction_count: 21, vote_count: 2,
    is_active: true, created_at: '2025-03-15', polygon_coop_id: 2,
  },
  {
    id: 3, name: 'Coopérative Maraîchère de Tsévié', code: 'CMT-003',
    region: 'Maritime', village: 'Tsévié', balance_fcfa: 540000,
    member_count: 15, transaction_count: 18, vote_count: 1,
    is_active: true, created_at: '2025-06-01', polygon_coop_id: 3,
  },
];

export const MOCK_TRANSACTIONS = [
  { id: 1, tx_type: 'ACHAT_INTRANT', direction: 'OUT', amount_fcfa: 85000, description: 'Achat engrais phosphaté', blockchain_status: 'CONFIRMED', polygon_tx_hash: '0x1a2b3c4d5e6f7890abcdef1234567890abcdef12', transaction_date: '2026-04-30' },
  { id: 2, tx_type: 'COTISATION', direction: 'IN', amount_fcfa: 300000, description: 'Cotisations membres — Avril 2026', blockchain_status: 'CONFIRMED', polygon_tx_hash: '0x9876fedcba0987654321fedcba0987654321fedc', transaction_date: '2026-04-05' },
  { id: 3, tx_type: 'PRIME_DISTRIBUTION', direction: 'OUT', amount_fcfa: 240000, description: 'Distribution prime récolte igname', blockchain_status: 'CONFIRMED', polygon_tx_hash: '0xabcdef1234567890abcdef1234567890abcdef12', transaction_date: '2026-03-20' },
  { id: 4, tx_type: 'ACHAT_INTRANT', direction: 'OUT', amount_fcfa: 350000, description: 'Location groupe motopompe', blockchain_status: 'CONFIRMED', polygon_tx_hash: '0xfedcba9876543210fedcba9876543210fedcba98', transaction_date: '2026-03-08' },
  { id: 5, tx_type: 'DEPENSE_ADMIN', direction: 'OUT', amount_fcfa: 15000, description: 'Frais déplacement assemblée', blockchain_status: 'CONFIRMED', polygon_tx_hash: '0x1234567890abcdef1234567890abcdef12345678', transaction_date: '2026-01-25' },
];

export const MOCK_VOTES = [
  { id: 1, title: 'Achat tracteur collectif Massey Ferguson', status: 'OPEN', votes_for: 3, votes_against: 1, quorum_required: 7, deadline: '2026-05-20T18:00:00Z', threshold_amount_fcfa: 2500000 },
  { id: 2, title: 'Achat engrais groupé Q2 2026', status: 'CLOSED', passed: true, votes_for: 9, votes_against: 2, quorum_required: 7, threshold_amount_fcfa: 250000 },
  { id: 3, title: 'Formation certification biologique', status: 'CLOSED', passed: false, votes_for: 4, votes_against: 5, quorum_required: 7, threshold_amount_fcfa: 45000 },
];

export const MOCK_SUMMARY = {
  balance_fcfa: 1285000,
  total_in_fcfa: 1825000,
  total_out_fcfa: 540000,
  transaction_count: 34,
  monthly: [
    { month: 'Jan', balance: 850000 },
    { month: 'Fév', balance: 980000 },
    { month: 'Mar', balance: 1100000 },
    { month: 'Avr', balance: 1020000 },
    { month: 'Mai', balance: 1285000 },
  ],
  by_category: {
    COTISATION:         { label: 'Cotisations',    value: 35, color: '#10b981' },
    ACHAT_INTRANT:      { label: 'Intrants',       value: 30, color: '#f59e0b' },
    PRIME_DISTRIBUTION: { label: 'Primes',         value: 20, color: '#3b82f6' },
    DEPENSE_ADMIN:      { label: 'Admin.',          value: 15, color: '#8b5cf6' },
  },
};