import { Injectable, signal } from '@angular/core';

export interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

@Injectable({
  providedIn: 'root'
})
export class PwaService {
  private deferredPrompt: BeforeInstallPromptEvent | null = null;

  readonly canInstall = signal(false);
  readonly isInstalled = signal(false);

  constructor() {
    this.initializePwaListeners();
  }

  private initializePwaListeners(): void {
    // Listen for the beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (e: Event) => {
      e.preventDefault();
      this.deferredPrompt = e as BeforeInstallPromptEvent;
      this.canInstall.set(true);
    });

    // Listen for the appinstalled event
    window.addEventListener('appinstalled', () => {
      this.isInstalled.set(true);
      //this.canInstall.set(false);
      //this.deferredPrompt = null;
    });

    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      this.isInstalled.set(true);
    }
  }

  async installPwa(): Promise<boolean> {
    if (!this.deferredPrompt) {
      return false;
    }

    try {
      await this.deferredPrompt.prompt();
      const { outcome } = await this.deferredPrompt.userChoice;

      this.deferredPrompt = null;
      this.canInstall.set(false);

      return outcome === 'accepted';
    } catch (error) {
      console.error('Error during PWA installation:', error);
      return false;
    }
  }

  dismissInstallPrompt(): void {
    this.canInstall.set(false);
    this.deferredPrompt = null;
  }
}
