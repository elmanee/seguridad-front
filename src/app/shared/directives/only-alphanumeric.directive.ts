import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appOnlyAlphanumeric]',
  standalone: true
})
export class OnlyAlphanumericDirective {
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete', 'Enter'];
    if (allowedKeys.includes(event.key)) return;

    const regex = /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ ]$/;
    
    if (!regex.test(event.key)) {
      event.preventDefault();
    }
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent) {
    event.preventDefault();
  }
}