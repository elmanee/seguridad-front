import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { AlertService } from '../../../core/services/alert.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authSvc = inject(AuthService);
  private router = inject(Router);
  private alertSvc = inject(AlertService);

  hidePassword = true;

  togglePassword() {
    this.hidePassword = !this.hidePassword;
  }

  loginForm = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  onSubmit() {
    if (this.loginForm.valid) {
      this.authSvc.login(this.loginForm.value).subscribe({
        next: () => {
          this.alertSvc.success('¡Qué onda de nuevo!', 'Bienvenido');
          this.router.navigate(['/dashboard'])
        },
        error: (err) => {
          this.alertSvc.error('Usuario o contraseña incorrectos', 'Error de acceso');
        }
      });
    }
  }
}
