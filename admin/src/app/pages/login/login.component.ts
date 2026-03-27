import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-page">
      <div class="login-bg">
        <div class="bg-grid"></div>
        <div class="bg-glow"></div>
      </div>

      <div class="login-card">
        <!-- Logo -->
        <div class="login-logo">
          <img src="assets/hd-logo.png" alt="HD" class="logo-img" />
        </div>

        <div class="login-header">
          <h1 class="login-title">Studio Access</h1>
          <p class="login-sub">HD Production Dashboard</p>
        </div>

        <form (ngSubmit)="onLogin()" class="login-form">
          <div class="form-group">
            <label class="form-label">Email</label>
            <input
              class="form-input"
              type="email"
              [(ngModel)]="email"
              name="email"
              placeholder="admin@hd.com"
              autocomplete="email"
              required
            />
          </div>

          <div class="form-group">
            <label class="form-label">Password</label>
            <div class="password-wrap">
              <input
                class="form-input"
                [type]="showPw() ? 'text' : 'password'"
                [(ngModel)]="password"
                name="password"
                placeholder="••••••••"
                autocomplete="current-password"
                required
              />
              <button type="button" class="pw-toggle" (click)="togglePw()">
                <svg *ngIf="!showPw()" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                </svg>
                <svg *ngIf="showPw()" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
                  <line x1="1" y1="1" x2="23" y2="23"/>
                </svg>
              </button>
            </div>
          </div>

          <div class="login-error" *ngIf="error()">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
            {{ error() }}
          </div>

          <button type="submit" class="btn btn-primary login-submit" [disabled]="loading()">
            <svg *ngIf="loading()" class="spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 12a9 9 0 11-6.22-8.56"/>
            </svg>
            {{ loading() ? 'Authenticating...' : 'Enter Studio' }}
          </button>
        </form>

        <div class="login-footer">
          <span class="mono-sm">HD PRODUCTION SYSTEM · PRIVATE ACCESS</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #090909;
      position: relative;
      overflow: hidden;
    }
    .login-bg {
      position: absolute;
      inset: 0;
      pointer-events: none;
    }
    .bg-grid {
      position: absolute;
      inset: 0;
      background-image:
        linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
      background-size: 60px 60px;
    }
    .bg-glow {
      position: absolute;
      top: 50%; left: 50%;
      transform: translate(-50%, -50%);
      width: 500px; height: 500px;
      background: radial-gradient(ellipse, rgba(212,0,26,0.08) 0%, transparent 70%);
    }
    .login-card {
      position: relative;
      background: #111111;
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 12px;
      padding: 2.5rem;
      width: 100%;
      max-width: 400px;
      box-shadow: 0 32px 80px rgba(0,0,0,0.6);
    }
    .login-logo {
      display: flex;
      justify-content: center;
      margin-bottom: 1.5rem;
    }
    .logo-img {
      width: 60px; height: 60px;
      object-fit: contain;
      filter: drop-shadow(0 0 12px rgba(212,0,26,0.4));
    }
    .login-header { text-align: center; margin-bottom: 2rem; }
    .login-title {
      font-family: 'Bebas Neue', sans-serif;
      font-size: 2rem;
      letter-spacing: 0.05em;
    }
    .login-sub {
      font-family: 'DM Mono', monospace;
      font-size: 0.7rem;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: rgba(255,255,255,0.3);
      margin-top: 0.25rem;
    }
    .login-form { display: flex; flex-direction: column; gap: 0; }
    .password-wrap { position: relative; }
    .password-wrap .form-input { padding-right: 2.5rem; }
    .pw-toggle {
      position: absolute;
      right: 0.75rem; top: 50%;
      transform: translateY(-50%);
      background: none; border: none;
      color: rgba(255,255,255,0.3);
      cursor: pointer;
      display: flex; align-items: center;
      transition: color 0.2s;
    }
    .pw-toggle:hover { color: rgba(255,255,255,0.7); }
    .login-error {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: rgba(212,0,26,0.08);
      border: 1px solid rgba(212,0,26,0.2);
      color: #ff6b6b;
      font-size: 0.8rem;
      padding: 0.75rem 1rem;
      border-radius: 4px;
      margin-bottom: 1rem;
    }
    .login-submit {
      width: 100%;
      justify-content: center;
      padding: 0.75rem;
      font-size: 0.85rem;
      letter-spacing: 0.05em;
      margin-top: 0.5rem;
    }
    .login-submit:disabled { opacity: 0.6; cursor: not-allowed; }
    .login-footer {
      margin-top: 2rem;
      text-align: center;
    }
    .mono-sm {
      font-family: 'DM Mono', monospace;
      font-size: 0.6rem;
      letter-spacing: 0.2em;
      color: rgba(255,255,255,0.15);
    }
    .spin { animation: spin 1s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
  `]
})
export class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  email = '';
  password = '';
  loading = signal(false);
  error = signal('');
  showPw = signal(false);
  togglePw() { this.showPw.set(!this.showPw()); }

  onLogin() {
    if (!this.email || !this.password) {
      this.error.set('Please enter your credentials.');
      return;
    }
    this.loading.set(true);
    this.error.set('');
    this.auth.login(this.email, this.password).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (err: any) => {
        this.loading.set(false);
        this.error.set(err?.error?.detail || 'Invalid credentials. Try again.');
      }
    });
  }
}
