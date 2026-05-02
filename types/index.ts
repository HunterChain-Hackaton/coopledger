export type Role = 'PRESIDENT' | 'TREASURER' | 'MEMBER' | 'AUDITOR' | 'MINISTRY' | 'ADMIN';

export interface Cooperative {
  id: number;
  name: string;
  code: string;
  region: string;
  village: string;
  phone_contact: string;
  polygon_coop_id: number;
  balance_fcfa: number;
  vote_threshold_fcfa: number;
  quorum_percent: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CooperativeMember {
  id: number;
  phone_number: string;
  full_name: string;
  cooperative: number | null;
  cooperative_name?: string;
  role: Role;
  national_id?: string;
  is_active: boolean;
  joined_at: string;
  last_login_at?: string;
  votes_participated: number;
  created_at: string;
}

export type TxType =
  | 'COTISATION'
  | 'ACHAT_INTRANT'
  | 'PRIME_DISTRIBUTION'
  | 'DEPENSE_ADMIN'
  | 'AUTRE';

export type TxDirection = 'IN' | 'OUT';
export type TxStatus = 'PENDING' | 'CONFIRMED' | 'FAILED';

export interface Transaction {
  id: number;
  cooperative: number;
  created_by: number | null;
  created_by_name?: string;
  tx_type: TxType;
  direction: TxDirection;
  amount_fcfa: number;
  description: string;
  reference_number?: string;
  attachment_url?: string;
  blockchain_status: TxStatus;
  polygon_tx_hash?: string;
  sha256_hash?: string;
  balance_after_fcfa?: number;
  transaction_date: string;
  created_at: string;
  confirmed_at?: string;
}

export type VoteStatus = 'OPEN' | 'CLOSED' | 'CANCELLED';

export interface CooperativeVote {
  id: number;
  cooperative: number;
  created_by: number | null;
  created_by_name?: string;
  title: string;
  description: string;
  description_hash: string;
  threshold_amount_fcfa: number;
  deadline: string;
  quorum_required: number;
  status: VoteStatus;
  votes_for: number;
  votes_against: number;
  quorum_reached: boolean;
  passed: boolean;
  onchain_vote_id?: number;
  create_tx_hash?: string;
  close_tx_hash?: string;
  created_at: string;
  closed_at?: string;
  total_votes?: number;
}

export interface Report {
  id: number;
  cooperative: number;
  period_start: string;
  period_end: string;
  opening_balance: number;
  total_in: number;
  total_out: number;
  closing_balance: number;
  pdf_url?: string;
  polygon_hash?: string;
  created_at: string;
}

export interface TransactionSummary {
  total_in: number;
  total_out: number;
  balance: number;
  by_type: Record<TxType, { in: number; out: number }>;
  monthly: Array<{ month: string; in: number; out: number; balance: number }>;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface Me {
  id: number;
  phone_number: string;
  full_name: string;
  role: Role;
  cooperative?: number;
  cooperative_name?: string;
  is_active: boolean;
}
