import { Component, inject, signal, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { SkeletonModule } from 'primeng/skeleton';
import { MessageModule } from 'primeng/message';
import { ToolbarModule } from 'primeng/toolbar';
import { TagModule } from 'primeng/tag';
import { AccountsService } from '../../services/accounts.service';
import { AuthService } from '../../../../auth/services/auth.service';
import { AccountDTO } from '../../types/accounts.types';

@Component({
  selector: 'app-accounts-list',
  imports: [
    ButtonModule,
    CardModule,
    SkeletonModule,
    MessageModule,
    ToolbarModule,
    TagModule
  ],
  templateUrl:'./accounts-list.component.html',
})
export class AccountsListComponent implements OnInit {
  private readonly accountsService = inject(AccountsService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly isLoading = signal(true);
  readonly errorMessage = signal<string | null>(null);
  readonly accounts = signal<AccountDTO[]>([]);
  readonly selectedBank = signal<any>(null);
  readonly linkId = signal<string>('');

  ngOnInit(): void {
    // Get linkId from route params
    this.route.params.subscribe(params => {
      this.linkId.set(params['linkId']);
      this.loadAccounts();
    });

    // Get selected bank from sessionStorage
    const bankData = sessionStorage.getItem('selectedBank');
    if (bankData) {
      this.selectedBank.set(JSON.parse(bankData));
    }
  }

  loadAccounts(): void {
    const linkId = this.linkId();
    if (!linkId) {
      this.errorMessage.set('No se proporcionó un ID de conexión válido');
      this.isLoading.set(false);
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.accountsService.retrieveAccounts({ link_id: linkId }).subscribe({
      next: (response) => {
        this.accounts.set(response.results);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading accounts:', error);
        this.errorMessage.set('Error al cargar las cuentas. Verifica tu conexión.');
        this.isLoading.set(false);
      }
    });
  }

  selectAccount(account: AccountDTO): void {
    // Store selected account and navigate to transactions
    sessionStorage.setItem('selectedAccount', JSON.stringify(account));
    this.router.navigate(['/transactions', account.id]);
  }

  goBack(): void {
    this.router.navigate(['/banks']);
  }

  getAccountCategorySeverity(category: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' {
    switch (category.toLowerCase()) {
      case 'checking':
      case 'corriente':
        return 'info';
      case 'savings':
      case 'ahorro':
        return 'success';
      case 'credit':
      case 'credito':
        return 'warn';
      case 'loan':
      case 'prestamo':
        return 'danger';
      default:
        return 'secondary';
    }
  }

  getNumericBalance(balance: string): number {
    return parseFloat(balance) || 0;
  }

  formatCurrency(amount: string, currency: string): string {
    const numAmount = parseFloat(amount);
    const formatter = new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: currency || 'USD',
      minimumFractionDigits: 2
    });
    return formatter.format(numAmount);
  }
}
