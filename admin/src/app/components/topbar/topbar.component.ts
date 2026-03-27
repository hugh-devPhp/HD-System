import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="topbar">
      <div class="topbar-left">
        <div class="topbar-breadcrumb">
          <span class="breadcrumb-root">HD Studio</span>
          <span class="breadcrumb-sep">/</span>
          <span class="breadcrumb-current">{{ title }}</span>
        </div>
      </div>

      <div class="topbar-right">
        <!-- Live indicator -->
        <div class="live-badge">
          <span class="live-dot"></span>
          <span>Live</span>
        </div>

        <!-- Portfolio link -->
        <a href="http://localhost:4200" target="_blank" class="topbar-btn" title="View Portfolio">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
            <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
          </svg>
          <span>Portfolio</span>
        </a>

        <!-- Admin avatar -->
        <div class="admin-avatar">HD</div>
      </div>
    </header>

    <!-- Toast container -->
    <div class="toast-container">
      <div
        class="toast"
        [class.success]="t.type === 'success'"
        [class.error]="t.type === 'error'"
        *ngFor="let t of toasts.toasts()"
      >
        <svg *ngIf="t.type === 'success'" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4ade80" stroke-width="2.5">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        <svg *ngIf="t.type === 'error'" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f87171" stroke-width="2.5">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
        {{ t.message }}
      </div>
    </div>
  `,
  styles: [`
    .topbar {
      height: 60px;
      background: #0D0D0D;
      border-bottom: 1px solid rgba(255,255,255,0.06);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 1.5rem;
      gap: 1rem;
    }

    .topbar-left { display: flex; align-items: center; gap: 1rem; }

    .topbar-breadcrumb {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-family: 'DM Mono', monospace;
      font-size: 0.72rem;
      letter-spacing: 0.05em;
    }
    .breadcrumb-root { color: rgba(255,255,255,0.25); }
    .breadcrumb-sep  { color: rgba(255,255,255,0.15); }
    .breadcrumb-current { color: rgba(255,255,255,0.7); }

    .topbar-right {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .live-badge {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      font-family: 'DM Mono', monospace;
      font-size: 0.65rem;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: rgba(100,220,100,0.7);
      background: rgba(100,220,100,0.06);
      border: 1px solid rgba(100,220,100,0.12);
      padding: 0.2rem 0.6rem;
      border-radius: 3px;
    }
    .live-dot {
      width: 6px; height: 6px;
      background: #4ade80;
      border-radius: 50%;
      animation: pulse 2s ease infinite;
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50%       { opacity: 0.4; }
    }

    .topbar-btn {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.35rem 0.75rem;
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 4px;
      font-size: 0.75rem;
      color: rgba(255,255,255,0.5);
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .topbar-btn:hover {
      background: rgba(255,255,255,0.08);
      color: rgba(255,255,255,0.9);
    }

    .admin-avatar {
      width: 30px; height: 30px;
      background: linear-gradient(135deg, #D4001A, #8B0011);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Bebas Neue', sans-serif;
      font-size: 0.75rem;
      letter-spacing: 0.05em;
      color: #fff;
      cursor: pointer;
    }
  `]
})
export class TopbarComponent {
  @Input() title = 'Overview';
  toasts = inject(ToastService);
}
