export interface KPIBalanceDTO {
  total_inflows: string;
  total_outflows: string;
  net_balance: string;
  currency: string;
  calculation_period: string;
  transactions_count: number;
}

export interface KPIBalanceRequestDTO {
  link_id: string;
  account_id: string;
  date_from: string;
  date_to: string;
}
