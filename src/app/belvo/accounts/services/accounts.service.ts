import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../shared/services/api.service';
import { AccountListResponseDTO, RetrieveAccountsRequest } from '../types/accounts.types';

@Injectable({
  providedIn: 'root'
})
export class AccountsService {
  private readonly apiService = inject(ApiService);

  retrieveAccounts(request: RetrieveAccountsRequest): Observable<AccountListResponseDTO> {
    return this.apiService.post<AccountListResponseDTO>('/belvo/accounts/', request);
  }
}
