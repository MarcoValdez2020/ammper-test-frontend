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
import { UserCreateDTO } from '../../types/auth.types';

@Component({
  selector: 'app-register',
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    CardModule,
    MessageModule,
    FloatLabelModule
  ],
  templateUrl:'./register.component.html'
})
export class RegisterComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  readonly isLoading = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly successMessage = signal<string | null>(null);

  readonly registerForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', [Validators.required]]
  });

  readonly passwordMismatch = signal(false);

  constructor() {
    // Watch for password confirmation changes
    this.registerForm.get('confirmPassword')?.valueChanges.subscribe(() => {
      this.checkPasswordMatch();
    });

    this.registerForm.get('password')?.valueChanges.subscribe(() => {
      this.checkPasswordMatch();
    });
  }

  private checkPasswordMatch(): void {
    const password = this.registerForm.get('password')?.value;
    const confirmPassword = this.registerForm.get('confirmPassword')?.value;

    if (confirmPassword && password !== confirmPassword) {
      this.passwordMismatch.set(true);
    } else {
      this.passwordMismatch.set(false);
    }
  }

  onSubmit(): void {
    if (this.registerForm.valid && !this.passwordMismatch()) {
      this.isLoading.set(true);
      this.errorMessage.set(null);
      this.successMessage.set(null);

      const userData: UserCreateDTO = {
        email: this.registerForm.value.email!,
        password: this.registerForm.value.password!
      };

      this.authService.register(userData).subscribe({
        next: () => {
          this.successMessage.set('¡Cuenta creada exitosamente! Redirigiendo...');
          setTimeout(() => {
            this.router.navigate(['/banks']);
          }, 1500);
        },
        error: (error) => {
          this.isLoading.set(false);
          this.errorMessage.set('Error al crear la cuenta. Verifica que el email no esté registrado.');
          console.error('Register error:', error);
        },
        complete: () => {
          this.isLoading.set(false);
        }
      });
    }
  }

  goToLogin(): void {
    this.router.navigate(['/auth/login']);
  }
}
