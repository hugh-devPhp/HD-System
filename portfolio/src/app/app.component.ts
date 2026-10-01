import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  // The navbar depends on the saved theme (localStorage): render it client-side only
  template: `
    <app-navbar ngSkipHydration></app-navbar>
    <main>
      <router-outlet></router-outlet>
    </main>
  `,
})
export class AppComponent {}
