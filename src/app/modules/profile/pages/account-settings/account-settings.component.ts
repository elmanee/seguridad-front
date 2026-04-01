import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../../../core/services/user.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Router } from '@angular/router';
import { AlertService } from '../../../../core/services/alert.service';

@Component({
  selector: 'app-account-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './account-settings.component.html'
})
export class AccountSettingsComponent implements OnInit {
  private fb = inject(FormBuilder);
  private userSvc = inject(UserService);
  private authSvc = inject(AuthService);
  private router = inject(Router)
  private alertSvc = inject(AlertService);

  userId: number | null = null;
  originalData: any = {}; 
  isFormChanged = false;

  profileForm = this.fb.group({
    name: ['', [Validators.required]],
    lastname: ['', [Validators.required]],
    username: ['', [Validators.required, Validators.minLength(4)]],
    password: ['']
  });

  ngOnInit() {
    this.userSvc.getMe().subscribe({
      next: (user) => {
        this.userId = user.id;
        this.originalData = {
          name: user.name,
          lastname: user.lastname,
          username: user.username
        };
        this.profileForm.patchValue(this.originalData);
        this.checkChanges();
      }
    });

    this.profileForm.valueChanges.subscribe(() => this.checkChanges());
  }

  checkChanges() {
    const currentValues = this.profileForm.value;
    const hasInfoChanged =
      currentValues.name !== this.originalData.name ||
      currentValues.lastname !== this.originalData.lastname ||
      currentValues.username !== this.originalData.username;

    this.isFormChanged = hasInfoChanged || (currentValues.password !== '' && currentValues.password !== null);
  }

  onUpdate() {
    if (this.profileForm.valid && this.userId) {
      const rawValues = this.profileForm.value;
      const dataToSend: any = {
        name: rawValues.name,
        lastname: rawValues.lastname,
        username: rawValues.username
      };

      if (rawValues.password && rawValues.password.trim() !== '') {
        dataToSend.password = rawValues.password;
      }

      this.userSvc.updateProfile(this.userId, dataToSend).subscribe({
        next: () => {
          this.alertSvc.success('Tu información se actualizó con éxito', 'Éxito');
          this.originalData = { ...dataToSend };
          this.profileForm.get('password')?.reset('');
          this.isFormChanged = false;
        }
      });
    }
  }

  onDelete() {
    this.alertSvc.confirm(
    '¿De plano vas a borrar tu cuenta?',
    'Se perderán todas tus tareas y no hay marcha atrás.',
    'Borrar definitivamente',
    'Mejor no'
  ).then(confirmed => {
    if (confirmed && this.userId) {
      this.userSvc.deleteAccount(this.userId).subscribe({
        next: () => {
          this.alertSvc.success('Cuenta eliminada. Esperamos verte pronto.');
          this.authSvc.clearTokens();
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.error('Error al borrar cuenta:', err);
          this.alertSvc.error('Error al borrar tu cuenta.', 'Error');
        }
      });
    }
  })

  }
}
