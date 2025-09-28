export interface AccountDTO {
  id: string;
  name: string;
  number: string;
  category: string;
  currency: string;
  balance_current: string;
  balance_available: string;
  balance_type: string;
  agency?: string;
}

export interface AccountListResponseDTO {
  count: number;
  next?: string;
  previous?: string;
  results: AccountDTO[];
}

export interface RetrieveAccountsRequest {
  link_id: string;
}
