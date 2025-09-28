import { Component, inject, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { SkeletonModule } from 'primeng/skeleton';
import { MessageModule } from 'primeng/message';
import { ToolbarModule } from 'primeng/toolbar';
import { BanksService } from '../../services/banks.service';
import { AuthService } from '../../../../auth/services/auth.service';
import { InstitutionDTO, ConnectionDTO } from '../../types/banks.types';

@Component({
  selector: 'app-banks-list',
  templateUrl: './banks-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonModule,
    CardModule,
    InputTextModule,
    SkeletonModule,
    MessageModule,
    ToolbarModule
  ]
})
export class BanksListComponent implements OnInit {
  private readonly banksService = inject(BanksService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly isLoading = signal(true);
  readonly errorMessage = signal<string | null>(null);
  readonly banks = signal<InstitutionDTO[]>([]);
  readonly filteredBanks = signal<InstitutionDTO[]>([]);
  readonly connections = signal<ConnectionDTO[]>([]);
  readonly currentUser = this.authService.currentUser;

  ngOnInit(): void {
    this.loadBanksAndConnections();

    // Get current user info if not already loaded
    if (!this.currentUser()) {
      this.authService.getCurrentUser().subscribe();
    }
  }

  loadBanksAndConnections(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    // Load both banks and connections in parallel
    forkJoin({
      banks: this.banksService.getAvailableBanks(),
      connections: this.banksService.getBankConnections()
    }).subscribe({
      next: ({ banks, connections }) => {
        this.banks.set(banks.results);
        this.filteredBanks.set(banks.results);
        this.connections.set(connections.results);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading banks and connections:', error);
        this.errorMessage.set('Error al cargar los bancos. Verifica tu conexión.');
        this.isLoading.set(false);
      }
    });
  }

  loadBanks(): void {
    this.loadBanksAndConnections();
  }

  onSearch(searchTerm: string): void {
    if (!searchTerm.trim()) {
      this.filteredBanks.set(this.banks());
      return;
    }

    const filtered = this.banks().filter(bank =>
      bank.display_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bank.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    this.filteredBanks.set(filtered);
  }

  selectBank(bank: InstitutionDTO): void {

    // Try different comparison strategies
    const connection = this.connections().find(conn =>
      conn.institution === bank.name
    );


    if (connection) {
      // Store selected bank and connection info
      sessionStorage.setItem('selectedBank', JSON.stringify(bank));
      sessionStorage.setItem('selectedConnection', JSON.stringify(connection));

      // Navigate to accounts with the link_id
      this.router.navigate(['/accounts', connection.id]);
    } else {
      alert(`No tienes cuentas vinculadas al banco ${bank.display_name}.`);
    }
  }

  logout(): void {
    this.authService.logout();
  }
}
