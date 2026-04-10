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

    const regex = /^[a-zA-Z0-9._]$/;
    
    if (!regex.test(event.key)) {
      event.preventDefault();
    }
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent) {
    event.preventDefault();
  }
}