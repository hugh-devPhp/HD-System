import { Component, HostListener, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar" [class.scrolled]="scrolled()">
      <div class="nav-inner container">
        <a href="#hero" class="nav-logo">
          <span class="logo-text">HD</span>
        </a>

        <div class="nav-links" [class.open]="menuOpen()">
          <a href="#about"    (click)="closeMenu()">About</a>
          <a href="#projects" (click)="closeMenu()">Projects</a>
          <a href="#stories"  (click)="closeMenu()">Stories</a>
          <a href="#contact"  (click)="closeMenu()" class="nav-cta">Contact</a>
        </div>

        <button class="nav-burger" (click)="toggleMenu()" [class.active]="menuOpen()" aria-label="Menu">
          <span></span><span></span><span></span>
        </button>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      position: fixed;
      top: 0; left: 0; right: 0;
      z-index: 100;
      padding: 1.5rem 0;
      transition: all 0.4s ease;
    }
    .navbar.scrolled {
      padding: 1rem 0;
      background: rgba(8,8,8,0.92);
      backdrop-filter: blur(16px);
      border-bottom: 1px solid rgba(255,255,255,0.06);
    }
    .nav-inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .nav-logo {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .logo-text {
      font-family: 'Bebas Neue', sans-serif;
      font-size: 1.8rem;
      color: #D4001A;
      letter-spacing: 0.05em;
      line-height: 1;
    }
    .nav-links {
      display: flex;
      align-items: center;
      gap: 2.5rem;
    }
    .nav-links a {
      font-family: 'DM Mono', monospace;
      font-size: 0.75rem;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: rgba(255,255,255,0.6);
      transition: color 0.3s ease;
    }
    .nav-links a:hover { color: #fff; }
    .nav-links .nav-cta {
      color: #D4001A;
      border: 1px solid rgba(212,0,26,0.4);
      padding: 0.4rem 1rem;
      border-radius: 2px;
    }
    .nav-links .nav-cta:hover {
      background: #D4001A;
      color: #fff;
    }
    .nav-burger {
      display: none;
      flex-direction: column;
      gap: 5px;
      background: none;
      border: none;
      cursor: pointer;
      padding: 4px;
    }
    .nav-burger span {
      display: block;
      width: 24px;
      height: 1.5px;
      background: #fff;
      transition: all 0.3s ease;
    }
    .nav-burger.active span:nth-child(1) { transform: translateY(6.5px) rotate(45deg); }
    .nav-burger.active span:nth-child(2) { opacity: 0; }
    .nav-burger.active span:nth-child(3) { transform: translateY(-6.5px) rotate(-45deg); }

    @media (max-width: 768px) {
      .nav-burger { display: flex; }
      .nav-links {
        position: fixed;
        top: 0; right: -100%;
        width: 280px; height: 100vh;
        background: #0D0D0D;
        border-left: 1px solid rgba(255,255,255,0.08);
        flex-direction: column;
        justify-content: center;
        gap: 2rem;
        transition: right 0.4s ease;
        padding: 2rem;
      }
      .nav-links.open { right: 0; }
      .nav-links a { font-size: 0.85rem; }
    }
  `]
})
export class NavbarComponent {
  scrolled = signal(false);
  menuOpen = signal(false);

  @HostListener('window:scroll')
  onScroll() {
    this.scrolled.set(window.scrollY > 50);
  }

  toggleMenu() { this.menuOpen.update(v => !v); }
  closeMenu()  { this.menuOpen.set(false); }
}
