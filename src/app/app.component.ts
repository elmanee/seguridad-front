import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar/navbar.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  ngOnInit() {
    this.bloquearInspeccion();
  }

  private bloquearInspeccion() {
    document.addEventListener('contextmenu', (event) => event.preventDefault());

    document.addEventListener('keydown', (event: KeyboardEvent) => {
      if (
        event.key === 'F12' || 
        (event.ctrlKey && event.shiftKey && (event.key === 'I' || event.key === 'J' || event.key === 'C')) || 
        (event.ctrlKey && event.key === 'u')
      ) {
        event.preventDefault();
      }
    });

    setInterval(() => {
      const antes = new Date().getTime();
      debugger; 
      const despues = new Date().getTime();
      if (despues - antes > 100) {
        console.clear();
        console.log("%c¡Acceso denegado!", "color: red; font-size: 30px; font-weight: bold;");
      }
    }, 100);
  }
}