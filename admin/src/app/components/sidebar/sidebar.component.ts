import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

interface NavItem {
  path: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLinkActive],
  template: `
    <aside class="sidebar">
      <!-- Brand -->
      <div class="sidebar-brand">
        <div class="brand-logo">
          <img src="assets/hd-logo.png" alt="HD" />
        </div>
        <div class="brand-info">
          <div class="brand-name">HD Studio</div>
          <div class="brand-role">Admin Dashboard</div>
        </div>
      </div>

      <div class="sidebar-divider"></div>

      <!-- Navigation -->
      <nav class="sidebar-nav">
        <div class="nav-section-label">Content</div>
        <a
          *ngFor="let item of navItems"
          [routerLink]="item.path"
          routerLinkActive="active"
          class="nav-item"
        >
          <span class="nav-icon" [innerHTML]="item.icon"></span>
          <span class="nav-label">{{ item.label }}</span>
        </a>
      </nav>

      <!-- Bottom actions -->
      <div class="sidebar-footer">
        <a routerLink="/homepage" routerLinkActive="active" class="nav-item">
          <span class="nav-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
          </span>
          <span class="nav-label">Homepage</span>
        </a>

        <a routerLink="/media" routerLinkActive="active" class="nav-item">
          <span class="nav-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
          </span>
          <span class="nav-label">Media</span>
        </a>

        <div class="sidebar-divider"></div>

        <button class="nav-item logout" (click)="logout()">
          <span class="nav-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </span>
          <span class="nav-label">Sign Out</span>
        </button>
      </div>
    </aside>
  `,
  styles: [`
    .sidebar {
      background: #0D0D0D;
      border-right: 1px solid rgba(255,255,255,0.06);
      height: 100%;
      display: flex;
      flex-direction: column;
      padding: 0;
      overflow-y: auto;
    }

    /* Brand */
    .sidebar-brand {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1.25rem 1rem;
    }
    .brand-logo {
      width: 34px; height: 34px;
      flex-shrink: 0;
    }
    .brand-logo img {
      width: 100%; height: 100%;
      object-fit: contain;
      filter: drop-shadow(0 0 8px rgba(212,0,26,0.4));
    }
    .brand-name {
      font-family: 'Bebas Neue', sans-serif;
      font-size: 1.1rem;
      letter-spacing: 0.06em;
      color: #fff;
      line-height: 1.1;
    }
    .brand-role {
      font-family: 'DM Mono', monospace;
      font-size: 0.6rem;
      letter-spacing: 0.15em;
      color: rgba(255,255,255,0.25);
      text-transform: uppercase;
    }

    .sidebar-divider {
      height: 1px;
      background: rgba(255,255,255,0.06);
      margin: 0.25rem 0;
    }

    /* Nav */
    .sidebar-nav {
      flex: 1;
      padding: 0.75rem 0.5rem;
    }
    .nav-section-label {
      font-family: 'DM Mono', monospace;
      font-size: 0.6rem;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: rgba(255,255,255,0.2);
      padding: 0.25rem 0.75rem 0.5rem;
    }
    .nav-item {
      display: flex;
      align-items: center;
      gap: 0.7rem;
      padding: 0.55rem 0.75rem;
      border-radius: 6px;
      color: rgba(255,255,255,0.5);
      font-size: 0.85rem;
      font-weight: 400;
      transition: all 0.2s ease;
      cursor: pointer;
      border: none;
      background: none;
      width: 100%;
      text-align: left;
      text-decoration: none;
      margin-bottom: 1px;
    }
    .nav-item:hover {
      background: rgba(255,255,255,0.04);
      color: rgba(255,255,255,0.85);
    }
    .nav-item.active {
      background: rgba(212,0,26,0.1);
      color: #fff;
      border: 1px solid rgba(212,0,26,0.15);
    }
    .nav-item.active .nav-icon { color: #D4001A; }
    .nav-icon {
      width: 16px; height: 16px;
      display: flex; align-items: center;
      flex-shrink: 0;
      color: rgba(255,255,255,0.3);
      transition: color 0.2s;
    }
    .nav-label { font-size: 0.82rem; }
    .logout { color: rgba(255,80,80,0.5); }
    .logout:hover { color: #ff6b6b; background: rgba(255,60,60,0.06); }

    /* Footer */
    .sidebar-footer {
      padding: 0.75rem 0.5rem;
      border-top: 1px solid rgba(255,255,255,0.04);
    }
  `]
})
export class SidebarComponent {
  private auth = inject(AuthService);

  navItems: NavItem[] = [
    {
      path: '/dashboard',
      label: 'Overview',
      icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
        <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
      </svg>`
    },
    {
      path: '/projects',
      label: 'Projects',
      icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
      </svg>`
    },
    {
      path: '/writing',
      label: 'Writing',
      icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
      </svg>`
    },
  ];

  logout() { this.auth.logout(); }
}
