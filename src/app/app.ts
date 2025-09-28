import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './auth/services/auth.service';
import { InstallPwaBannerComponent } from './shared/components/install-pwa-banner/install-pwa-banner.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, InstallPwaBannerComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  private readonly authService = inject(AuthService);

  ngOnInit(): void {
    // Initialize authentication state on app startup
    this.authService.initializeAuth();
  }
}
