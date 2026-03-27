import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { TopbarComponent } from '../../components/topbar/topbar.component';
import { AdminApiService } from '../../services/admin-api.service';
import { ToastService } from '../../services/toast.service';

interface ContentField {
  key: string;
  label: string;
  hint: string;
  multiline?: boolean;
  value: string;
}

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent, TopbarComponent],
  template: `
    <div class="admin-layout">
      <app-topbar title="Homepage" class="admin-topbar"></app-topbar>
      <app-sidebar class="admin-sidebar"></app-sidebar>

      <main class="admin-content">
        <div class="page-header">
          <div class="page-header-row">
            <div>
              <h1 class="page-title">Homepage Editor</h1>
              <p class="page-sub">Edit all public-facing homepage content</p>
            </div>
            <div style="display:flex; gap:0.75rem">
              <a href="http://localhost:4200" target="_blank" class="btn btn-secondary">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
                  <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                </svg>
                Preview Live
              </a>
              <button class="btn btn-primary" (click)="save()" [disabled]="saving()">
                {{ saving() ? 'Saving…' : 'Save All Changes' }}
              </button>
            </div>
          </div>
        </div>

        <div class="page-body" *ngIf="!loading()">
          <div class="editor-layout">
            <!-- Form -->
            <div class="editor-fields">

              <!-- Hero section -->
              <div class="field-section">
                <div class="field-section-title">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                  Hero Section
                </div>

                <div class="form-group" *ngFor="let f of heroFields()">
                  <label class="form-label">
                    {{ f.label }}
                    <span class="field-hint">{{ f.hint }}</span>
                  </label>
                  <textarea *ngIf="f.multiline" class="form-input" [(ngModel)]="f.value" rows="3"></textarea>
                  <input *ngIf="!f.multiline" class="form-input" [(ngModel)]="f.value" />
                </div>
              </div>

              <!-- About section -->
              <div class="field-section">
                <div class="field-section-title">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  About Section
                </div>

                <div class="form-group" *ngFor="let f of aboutFields()">
                  <label class="form-label">
                    {{ f.label }}
                    <span class="field-hint">{{ f.hint }}</span>
                  </label>
                  <textarea *ngIf="f.multiline" class="form-input" [(ngModel)]="f.value" rows="6"></textarea>
                  <input *ngIf="!f.multiline" class="form-input" [(ngModel)]="f.value" />
                </div>
              </div>

              <!-- Contact section -->
              <div class="field-section">
                <div class="field-section-title">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                  </svg>
                  Contact Section
                </div>

                <div class="form-group" *ngFor="let f of contactFields()">
                  <label class="form-label">
                    {{ f.label }}
                    <span class="field-hint">{{ f.hint }}</span>
                  </label>
                  <textarea *ngIf="f.multiline" class="form-input" [(ngModel)]="f.value" rows="2"></textarea>
                  <input *ngIf="!f.multiline" class="form-input" [(ngModel)]="f.value" />
                </div>
              </div>

            </div>

            <!-- Live preview -->
            <div class="editor-preview">
              <div class="preview-label">
                <span class="preview-dot"></span>
                Live Preview
              </div>
              <div class="preview-card">
                <div class="preview-hero">
                  <div class="preview-logo">HD</div>
                  <div class="preview-tagline">{{ getVal('tagline') }}</div>
                  <div class="preview-intro">{{ getVal('hero_intro') }}</div>
                  <div class="preview-btns">
                    <div class="preview-btn-primary">View Projects</div>
                    <div class="preview-btn-outline">Contact</div>
                  </div>
                </div>
                <div class="preview-divider"></div>
                <div class="preview-about">
                  <div class="preview-section-label">ABOUT</div>
                  <div class="preview-about-text">{{ getVal('about_text') | slice:0:200 }}...</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="page-body" *ngIf="loading()">
          <div class="empty-state">
            <div class="spin-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation:spin 1s linear infinite">
                <path d="M21 12a9 9 0 11-6.22-8.56"/>
              </svg>
            </div>
            <p class="empty-sub">Loading content...</p>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .page-header-row { display: flex; justify-content: space-between; align-items: flex-start; }

    .editor-layout {
      display: grid;
      grid-template-columns: 1fr 380px;
      gap: 2rem;
      align-items: start;
    }
    @media (max-width: 1200px) { .editor-layout { grid-template-columns: 1fr; } }

    /* Fields */
    .editor-fields { display: flex; flex-direction: column; gap: 1.5rem; }

    .field-section {
      background: #111;
      border: 1px solid rgba(255,255,255,0.06);
      border-radius: 10px;
      padding: 1.5rem;
    }
    .field-section-title {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.78rem;
      font-weight: 600;
      color: rgba(255,255,255,0.5);
      letter-spacing: 0.08em;
      text-transform: uppercase;
      font-family: 'DM Mono', monospace;
      margin-bottom: 1.25rem;
      color: rgba(255,255,255,0.45);
    }
    .field-hint {
      font-weight: 400;
      font-family: 'Outfit', sans-serif;
      text-transform: none;
      letter-spacing: 0;
      color: rgba(255,255,255,0.25);
      font-size: 0.72rem;
      margin-left: 0.5rem;
    }

    /* Preview */
    .editor-preview {
      position: sticky;
      top: 1.5rem;
    }
    .preview-label {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      font-family: 'DM Mono', monospace;
      font-size: 0.65rem;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: rgba(255,255,255,0.3);
      margin-bottom: 0.75rem;
    }
    .preview-dot {
      width: 6px; height: 6px;
      background: #4ade80;
      border-radius: 50%;
      animation: pulse 2s ease infinite;
    }
    @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
    @keyframes spin { to { transform: rotate(360deg); } }

    .preview-card {
      background: #080808;
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 10px;
      overflow: hidden;
    }
    .preview-hero {
      padding: 2rem 1.5rem;
      background: linear-gradient(to bottom, #080808, #0D0D0D);
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 0.6rem;
    }
    .preview-logo {
      font-family: 'Bebas Neue', sans-serif;
      font-size: 2.5rem;
      color: #D4001A;
      letter-spacing: 0.05em;
      line-height: 1;
    }
    .preview-tagline {
      font-family: 'Bebas Neue', sans-serif;
      font-size: 0.95rem;
      letter-spacing: 0.05em;
      color: rgba(255,255,255,0.85);
    }
    .preview-intro { font-size: 0.7rem; color: rgba(255,255,255,0.4); line-height: 1.6; max-width: 280px; }
    .preview-btns { display: flex; gap: 0.5rem; margin-top: 0.5rem; }
    .preview-btn-primary { background: #D4001A; color: #fff; padding: 0.35rem 0.9rem; border-radius: 2px; font-size: 0.65rem; font-weight: 500; text-transform: uppercase; letter-spacing: 0.06em; }
    .preview-btn-outline { border: 1px solid rgba(255,255,255,0.2); color: rgba(255,255,255,0.6); padding: 0.35rem 0.9rem; border-radius: 2px; font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.06em; }
    .preview-divider { height: 1px; background: rgba(255,255,255,0.06); }
    .preview-about { padding: 1.25rem 1.5rem; }
    .preview-section-label { font-family: 'DM Mono', monospace; font-size: 0.55rem; letter-spacing: 0.25em; color: #D4001A; margin-bottom: 0.75rem; }
    .preview-about-text { font-size: 0.72rem; color: rgba(255,255,255,0.4); line-height: 1.7; }

    .spin-icon { animation: spin 1s linear infinite; }
  `]
})
export class HomepageComponent implements OnInit {
  private api    = inject(AdminApiService);
  private toasts = inject(ToastService);

  loading = signal(true);
  saving  = signal(false);
  fields  = signal<ContentField[]>([]);

  fieldDefs: Omit<ContentField, 'value'>[] = [
    { key: 'hero_title',    label: 'Hero Title',    hint: 'Usually "HD"', multiline: false },
    { key: 'hero_subtitle', label: 'Hero Subtitle', hint: 'Your name', multiline: false },
    { key: 'tagline',       label: 'Tagline',       hint: 'Main catchphrase', multiline: false },
    { key: 'hero_intro',    label: 'Hero Intro',    hint: 'Short cinematic sentence', multiline: true },
    { key: 'about_text',    label: 'About Text',    hint: 'Narrative bio. Use \\n\\n for paragraphs.', multiline: true },
    { key: 'contact_message', label: 'Contact Message', hint: 'Closing CTA message', multiline: true },
    { key: 'email',    label: 'Email',    hint: 'Public email address', multiline: false },
    { key: 'whatsapp', label: 'WhatsApp', hint: 'With country code, e.g. +33600000000', multiline: false },
  ];

  heroFields    = () => this.fields().filter(f => ['hero_title','hero_subtitle','tagline','hero_intro'].includes(f.key));
  aboutFields   = () => this.fields().filter(f => ['about_text'].includes(f.key));
  contactFields = () => this.fields().filter(f => ['contact_message','email','whatsapp'].includes(f.key));

  ngOnInit() {
    this.api.getHomepage().subscribe({
      next: items => {
        const map = new Map(items.map(i => [i.key, i.value]));
        this.fields.set(this.fieldDefs.map(def => ({
          ...def,
          value: map.get(def.key) ?? ''
        })));
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  getVal(key: string): string {
    return this.fields().find(f => f.key === key)?.value ?? '';
  }

  save() {
    this.saving.set(true);
    const items = this.fields().map(f => ({ key: f.key, value: f.value }));
    this.api.updateHomepage(items).subscribe({
      next: () => { this.toasts.show('Homepage content saved.', 'success'); this.saving.set(false); },
      error: () => { this.toasts.show('Save failed.', 'error'); this.saving.set(false); }
    });
  }
}
