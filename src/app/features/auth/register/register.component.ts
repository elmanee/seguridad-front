import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { AlertService } from '../../../core/services/alert.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private alertSvc = inject(AlertService);

  hidePassword = true;

  registerForm = this.fb.group({
    name: ['', [Validators.required]],
    lastname: ['', [Validators.required]],
    username: ['', [Validators.required, Validators.minLength(4)]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  onRegister() {
    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.value).subscribe({
      next: () => {
        this.alertSvc.success('Tu cuenta ha sido creada. ¡Ya puedes entrar!', '¡Listo!');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.alertSvc.error(err.error.message || 'No se pudo crear la cuenta', 'Hubo un problema');
      }
      });
    }
  }

  togglePassword() {
    this.hidePassword = !this.hidePassword;
  }
}