import { Component, inject, signal, OnInit, computed, ChangeDetectionStrategy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { SkeletonModule } from 'primeng/skeleton';
import { MessageModule } from 'primeng/message';
import { ToolbarModule } from 'primeng/toolbar';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { TransactionsService } from '../../services/transactions.service';
import { BalanceService } from '../../../balance/services/balance.service';
import { KpiBalanceComponent } from '../../../balance/components/kpi-balance/kpi-balance.component';
import { TransactionDTO } from '../../types/transactions.types';
import { KPIBalanceDTO } from '../../../balance/types/balance.types';

@Component({
  selector: 'app-transactions-list',
  templateUrl: './transactions-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    CardModule,
    SkeletonModule,
    MessageModule,
    ToolbarModule,
    TagModule,
    DividerModule,
    DatePickerModule,
    SelectModule,
    KpiBalanceComponent
  ]
})
export class TransactionsListComponent implements OnInit {
  private readonly transactionsService = inject(TransactionsService);
  private readonly balanceService = inject(BalanceService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);

  readonly isLoading = signal(true);
  readonly errorMessage = signal<string | null>(null);
  readonly transactions = signal<TransactionDTO[]>([]);
  readonly kpiBalance = signal<KPIBalanceDTO | null>(null);
  readonly selectedAccount = signal<any>(null);
  readonly accountId = signal<string>('');

  // Filter properties
  readonly selectedDatePreset = signal<string>('30 días');
  readonly today = new Date();
  readonly currentPage = signal(1);
  readonly hasMorePages = signal(true);
  readonly isLoadingMore = signal(false);

  // Reactive Form for filters
  readonly filtersForm: FormGroup = this.fb.group({
    dateFrom: [null],
    dateTo: [null],
    transactionType: [null]
  });

  // Filtered transactions
  readonly filteredTransactions = computed(() => {
    const transactions = this.transactions();
    const transactionType = this.filtersForm.get('transactionType')?.value;
    if (!transactionType) return transactions;
    return transactions.filter(t => t.type === transactionType);
  });

  // Options
  readonly datePresets = [
    { label: '7 días', value: 7 },
    { label: '30 días', value: 30 },
    { label: '3 meses', value: 90 },
    { label: '6 meses', value: 180 }
  ];

  readonly transactionTypeOptions = [
    { label: 'Todos', value: null },
    { label: 'Ingresos', value: 'INFLOW' },
    { label: 'Egresos', value: 'OUTFLOW' }
  ];

  ngOnInit(): void {
    // Initialize default date range (last 30 days)
    this.initializeDefaultDates();

    // Get accountId from route params
    this.route.params.subscribe(params => {
      this.accountId.set(params['accountId']);
      this.loadData();
    });

    // Get selected account from sessionStorage
    const accountData = sessionStorage.getItem('selectedAccount');
    if (accountData) {
      this.selectedAccount.set(JSON.parse(accountData));
    }
  }

  private initializeDefaultDates(): void {
    const dateTo = new Date();
    const dateFrom = new Date();
    dateFrom.setDate(dateFrom.getDate() - 30);

    this.filtersForm.patchValue({
      dateFrom,
      dateTo
    });
  }

  loadData(): void {
    const accountId = this.accountId();
    if (!accountId) {
      this.errorMessage.set('No se proporcionó un ID de cuenta válido');
      this.isLoading.set(false);
      return;
    }

    // Get connection info from sessionStorage
    const connectionData = sessionStorage.getItem('selectedConnection');
    if (!connectionData) {
      this.errorMessage.set('No se encontró información de conexión');
      this.isLoading.set(false);
      return;
    }

    const connection = JSON.parse(connectionData);
    const linkId = connection.id;

    // Get dates from form
    const dateFrom = this.filtersForm.get('dateFrom')?.value;
    const dateTo = this.filtersForm.get('dateTo')?.value;

    if (!dateFrom || !dateTo) {
      this.errorMessage.set('Por favor selecciona un rango de fechas válido');
      this.isLoading.set(false);
      return;
    }

    const dateFromStr = dateFrom.toISOString().split('T')[0];
    const dateToStr = dateTo.toISOString().split('T')[0];

    this.isLoading.set(true);
    this.errorMessage.set(null);

    // Load both KPI balance and transactions in parallel
    forkJoin({
      balance: this.balanceService.calculateKPIBalance({
        link_id: linkId,
        account_id: accountId,
        date_from: dateFromStr,
        date_to: dateToStr
      }),
      transactions: this.transactionsService.listTransactions({
        link_id: linkId,
        account_id: accountId,
        date_from: dateFromStr,
        date_to: dateToStr,
        page: 1,
        page_size: 50
      })
    }).subscribe({
      next: ({ balance, transactions }) => {
        this.kpiBalance.set(balance);
        this.transactions.set(transactions.results);
        this.hasMorePages.set(transactions.has_next);
        this.currentPage.set(1);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading data:', error);
        this.errorMessage.set('Error al cargar los datos. Verifica tu conexión.');
        this.isLoading.set(false);
      }
    });
  }

  goBack(): void {
    // Get back to accounts with the linkId
    const connectionData = sessionStorage.getItem('selectedConnection');
    if (connectionData) {
      const connection = JSON.parse(connectionData);
      this.router.navigate(['/accounts', connection.id]);
    } else {
      this.router.navigate(['/banks']);
    }
  }

  formatCurrency(amount: string, currency: string): string {
    const numAmount = Math.abs(parseFloat(amount));
    const formatter = new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: currency || 'USD',
      minimumFractionDigits: 2
    });
    return formatter.format(numAmount);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  getStatusLabel(status: string): string {
    switch (status.toLowerCase()) {
      case 'processed':
        return 'Procesada';
      case 'pending':
        return 'Pendiente';
      case 'failed':
        return 'Fallida';
      default:
        return status;
    }
  }

  // Filter methods with Reactive Forms
  applyDatePreset(preset: { label: string; value: number }): void {
    this.selectedDatePreset.set(preset.label);
    const dateTo = new Date();
    const dateFrom = new Date();
    dateFrom.setDate(dateFrom.getDate() - preset.value);

    this.filtersForm.patchValue({
      dateFrom,
      dateTo
    });

    this.applyFilters();
  }

  onDateChange(): void {
    this.selectedDatePreset.set('Personalizado');
  }

  applyFilters(): void {
    this.currentPage.set(1);
    this.transactions.set([]);
    this.loadData();
  }

  resetFilters(): void {
    this.selectedDatePreset.set('30 días');
    this.initializeDefaultDates();
    this.filtersForm.patchValue({
      transactionType: null
    });
    this.applyFilters();
  }

  loadMoreTransactions(): void {
    if (this.isLoadingMore() || !this.hasMorePages()) return;

    const accountId = this.accountId();
    const connectionData = sessionStorage.getItem('selectedConnection');
    if (!connectionData || !accountId) return;

    const connection = JSON.parse(connectionData);
    const linkId = connection.id;

    const dateFrom = this.filtersForm.get('dateFrom')?.value;
    const dateTo = this.filtersForm.get('dateTo')?.value;

    if (!dateFrom || !dateTo) return;

    const dateFromStr = dateFrom.toISOString().split('T')[0];
    const dateToStr = dateTo.toISOString().split('T')[0];

    this.isLoadingMore.set(true);

    this.transactionsService.listTransactions({
      link_id: linkId,
      account_id: accountId,
      date_from: dateFromStr,
      date_to: dateToStr,
      page: this.currentPage() + 1,
      page_size: 50
    }).subscribe({
      next: (response) => {
        const currentTransactions = this.transactions();
        this.transactions.set([...currentTransactions, ...response.results]);
        this.currentPage.set(this.currentPage() + 1);
        this.hasMorePages.set(response.has_next);
        this.isLoadingMore.set(false);
      },
      error: (error) => {
        console.error('Error loading more transactions:', error);
        this.isLoadingMore.set(false);
      }
    });
  }
}
