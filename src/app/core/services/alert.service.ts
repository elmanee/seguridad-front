import { Injectable, inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Injectable({ providedIn: 'root' })
export class AlertService {
  private toastr = inject(ToastrService);

  success(message: string, title: string = '¡Hecho!') {
    this.toastr.success(message, title, {
      progressBar: true,
      positionClass: 'toast-bottom-right'
    });
  }

  error(message: string, title: string = 'Error') {
    this.toastr.error(message, title, {
      progressBar: true
    });
  }

  confirm(
    title: string,
    text: string,
    confirmButtonText = 'Sí, continuar',
    cancelButtonText = 'Cancelar',
    icon: SweetAlertIcon = 'warning'
  ): Promise<boolean> {
    return Swal.fire({
      title,
      text,
      icon,
      showCancelButton: true,
      confirmButtonText,
      cancelButtonText,
      reverseButtons: true,
      confirmButtonColor: '#0d6efd',
      cancelButtonColor: '#f8f9fa',
      customClass: {
        confirmButton: 'btn btn-primary px-4 py-2 fw-bold shadow-sm',
        cancelButton: 'btn btn-light px-4 py-2 fw-bold text-muted border ms-2 me-2'
      },
      buttonsStyling: false,
      background: '#ffffff',
      color: '#212529'
    }).then(result => result.isConfirmed);
  }
}
