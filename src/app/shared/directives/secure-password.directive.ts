import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appSecurePassword]',
  standalone: true
})
export class SecurePasswordDirective {
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    // Permetre tecles de control vitales
    const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete', 'Enter'];
    if (allowedKeys.includes(event.key)) return;

    // BLOQUEIG D'INJECCIÓ SQL I XSS:
    // Bloquegem: ' (cometa simple), " (cometa doble), ; (punt i coma), 
    // < > (etiquetes HTML), \ (barra invertida) i l'espai.
    const forbiddenChars = ["'", '"', ';', '<', '>', '\\', ' '];
    
    if (forbiddenChars.includes(event.key)) {
      event.preventDefault(); // Impedeix que el caràcter s'escrigui
      return;
    }

    // Opcional: Regex per permetre només el que volem (Alfanumèric + símbols segurs)
    const regex = /^[a-zA-Z0-9!@#$%^&*()_\-+=]$/;
    if (!regex.test(event.key)) {
      event.preventDefault();
    }
  }
}