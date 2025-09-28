export interface InstitutionDTO {
  id: string | number;
  name: string;
  type: string;
  code?: string;
  country_code: string;
  website?: string;
  display_name: string;
  primary_color?: string;
  logo?: string;
}

export interface InstitutionListResponseDTO {
  count: number;
  next?: string;
  previous?: string;
  results: InstitutionDTO[];
}

export interface CreateConnectionDTO {
  institution: string;
  username: string;
  password: string;
}

export interface ConnectionDTO {
  id: string;
  institution: string;
  access_mode: string;
  status: string;
  refresh_rate: string;
  created_by: string;
  last_accessed_at: string;
  external_id?: string;
  created_at: string;
  institution_user_id: string;
  credentials_storage: string;
  stale_in?: string;
  fetch_resources: string[];
}

export interface ConnectionListResponseDTO {
  count: number;
  next?: string;
  previous?: string;
  results: ConnectionDTO[];
}
