import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appSecurePassword]',
  standalone: true
})
export class SecurePasswordDirective {
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete', 'Enter'];
    if (allowedKeys.includes(event.key)) return;
    const forbiddenChars = ["'", '"', ';', '<', '>', '\\', ' '];
    
    if (forbiddenChars.includes(event.key)) {
      event.preventDefault();
      return;
    }

    const regex = /^[a-zA-Z0-9!@#$%^&*()_\-+=]$/;
    if (!regex.test(event.key)) {
      event.preventDefault();
    }
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent) {
    event.preventDefault();
  }
}