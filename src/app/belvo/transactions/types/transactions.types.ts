export interface TransactionDTO {
  id: string;
  description: string;
  amount: string;
  currency: string;
  type: string;
  status: string;
  value_date: string;
  category?: string;
  merchant_name?: string;
}

export interface TransactionListPaginatedResponseDTO {
  count: number;
  page: number;
  page_size: number;
  total_pages: number;
  has_next: boolean;
  has_previous: boolean;
  results: TransactionDTO[];
}

export interface TransactionsListRequest {
  link_id: string;
  account_id: string;
  date_from: string;
  date_to: string;
  page?: number;
  page_size?: number;
}

export interface TransactionsRequest {
  link_id: string;
  account_id: string;
  date_from: string;
  date_to: string;
}
