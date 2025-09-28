import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { CardModule } from 'primeng/card';
import { MessageModule } from 'primeng/message';
import { FloatLabelModule } from 'primeng/floatlabel';
import { AuthService } from '../../services/auth.service';
import { UserLoginDTO } from '../../types/auth.types';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    CardModule,
    MessageModule,
    FloatLabelModule
  ],
  templateUrl:'./login.component.html'
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  readonly isLoading = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]]
  });

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading.set(true);
      this.errorMessage.set(null);

      const credentials: UserLoginDTO = this.loginForm.value as UserLoginDTO;

      this.authService.login(credentials).subscribe({
        next: () => {
          this.router.navigate(['/banks']);
        },
        error: (error) => {
          this.isLoading.set(false);
          this.errorMessage.set('Credenciales incorrectas. Verifica tu email y contraseña.');
          console.error('Login error:', error);
        },
        complete: () => {
          this.isLoading.set(false);
        }
      });
    }
  }

  goToRegister(): void {
    this.router.navigate(['/auth/register']);
  }
}
