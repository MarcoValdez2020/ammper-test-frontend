import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { CardModule } from 'primeng/card';
import { SkeletonModule } from 'primeng/skeleton';
import { KPIBalanceDTO } from '../../types/balance.types';

@Component({
  selector: 'app-kpi-balance',
  templateUrl: './kpi-balance.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CardModule,
    SkeletonModule
  ]
})
export class KpiBalanceComponent {
  // Input signals
  readonly kpiData = input<KPIBalanceDTO | null>(null);
  readonly isLoading = input<boolean>(false);

  formatCurrency(amount: string, currency: string): string {
    const numAmount = Math.abs(parseFloat(amount));
    const formatter = new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: currency || 'USD',
      minimumFractionDigits: 2
    });
    return formatter.format(numAmount);
  }
}