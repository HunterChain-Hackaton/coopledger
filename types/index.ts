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



// ── Types publics ─────────────────────────────────────────────────────────────
export interface PublicCooperative {
  id:               number;
  name:             string;
  code:             string;
  region:           string;
  village:          string;
  balance_fcfa:     number;
  member_count:     number;
  transaction_count:number;
  vote_count:       number;
  is_active:        boolean;
  created_at:       string;
  polygon_coop_id:  number;
}

export interface CoopApplication {
  id:              number;
  name:            string;
  president_name:  string;
  president_email: string;
  phone:           string;
  email:           string;
  address:         string;
  region:          string;
  member_count:    number;
  fiscal_number:   string;
  status:          'PENDING' | 'APPROVED' | 'REJECTED';
  rejection_reason?:string;
  submitted_at:    string;
}


export interface CotisationCampaign {
  id:                    number;
  title:                 string;
  description:           string;
  amount_fcfa:           number;
  target:                'ALL' | 'FARMERS' | 'MANUAL';
  status:                'OPEN' | 'CLOSED';
  deadline?:             string;
  created_by_name:       string;
  total_collected_fcfa:  number;
  paid_count:            number;
  target_count:          number;
  progress_pct:          number;
  user_payment?:         { status: string; amount_fcfa: number; operator: string; confirmed_at?: string } | null;
  created_at:            string;
  closed_at?:            string;
}

export interface CotisationPayment {
  id:                    number;
  member_name:           string;
  amount_fcfa:           number;
  phone_number:          string;
  operator:              string;
  status:                string;
  fedapay_transaction_id?: string;
  blockchain_status:     string;
  polygon_tx_hash?:      string;
  polygonscan_url?:      string;
  initiated_at:          string;
  confirmed_at?:         string;
}