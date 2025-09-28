import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../shared/services/api.service';
import { TransactionListPaginatedResponseDTO, TransactionsListRequest, TransactionsRequest } from '../types/transactions.types';

@Injectable({
  providedIn: 'root'
})
export class TransactionsService {
  private readonly apiService = inject(ApiService);

  refreshTransactions(request: TransactionsRequest): Observable<any> {
    return this.apiService.post('/belvo/transactions/refresh/', request);
  }

  listTransactions(request: TransactionsListRequest): Observable<TransactionListPaginatedResponseDTO> {
    return this.apiService.post<TransactionListPaginatedResponseDTO>('/belvo/transactions/list/', request);
  }
}
