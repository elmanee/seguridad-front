import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appOnlyUsername]',
  standalone: true
})
export class OnlyUsernameDirective {
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete', 'Enter'];
    if (allowedKeys.includes(event.key)) return;

    // Regex: Permite letras, números, punto y guion bajo. NO permite espacios.
    const regex = /^[a-zA-Z0-9._]$/;
    
    if (!regex.test(event.key)) {
      event.preventDefault(); // Bloquea todo lo demás (espacios, comas, comillas, etc.)
    }
  }
}