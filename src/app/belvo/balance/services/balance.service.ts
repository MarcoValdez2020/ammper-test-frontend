import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../shared/services/api.service';
import { KPIBalanceDTO, KPIBalanceRequestDTO } from '../types/balance.types';

@Injectable({
  providedIn: 'root'
})
export class BalanceService {
  private readonly apiService = inject(ApiService);

  calculateKPIBalance(request: KPIBalanceRequestDTO): Observable<KPIBalanceDTO> {
    return this.apiService.post<KPIBalanceDTO>('/belvo/kpi-balance/', request);
  }
}
