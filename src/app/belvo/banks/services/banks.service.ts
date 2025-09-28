import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../shared/services/api.service';
import { InstitutionListResponseDTO, CreateConnectionDTO, ConnectionListResponseDTO } from '../types/banks.types';

@Injectable({
  providedIn: 'root'
})
export class BanksService {
  private readonly apiService = inject(ApiService);

  getAvailableBanks(): Observable<InstitutionListResponseDTO> {
    return this.apiService.get<InstitutionListResponseDTO>('/belvo/banks/');
  }

  searchBanksByName(displayName: string): Observable<InstitutionListResponseDTO> {
    return this.apiService.get<InstitutionListResponseDTO>(`/belvo/banks/search?display_name=${encodeURIComponent(displayName)}`);
  }

  createBankConnection(connectionData: CreateConnectionDTO): Observable<any> {
    return this.apiService.post('/belvo/connections/', connectionData);
  }

  getBankConnections(page: number = 1, pageSize: number = 100): Observable<ConnectionListResponseDTO> {
    return this.apiService.get<ConnectionListResponseDTO>(`/belvo/connections/?page=${page}&page_size=${pageSize}`);
  }
}
