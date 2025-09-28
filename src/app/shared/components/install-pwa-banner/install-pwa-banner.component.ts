import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { PwaService } from '../../services/pwa.service';

@Component({
  selector: 'app-install-pwa-banner',
  templateUrl: './install-pwa-banner.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonModule,
    CardModule
  ]
})
export class InstallPwaBannerComponent {
  private readonly pwaService = inject(PwaService);

  readonly canInstall = this.pwaService.canInstall;
  readonly isInstalled = this.pwaService.isInstalled;

  async installApp(): Promise<void> {
    const success = await this.pwaService.installPwa();
    if (success) {
      console.log('PWA installed successfully!');
    }
  }

  dismissBanner(): void {
    this.pwaService.dismissInstallPrompt();
  }
}
