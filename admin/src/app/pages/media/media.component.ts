import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { TopbarComponent } from '../../components/topbar/topbar.component';
import { AdminApiService } from '../../services/admin-api.service';
import { ToastService } from '../../services/toast.service';
import { environment } from '../../../environments/environment';

interface MediaFile { filename: string; url: string; size: number; }

@Component({
  selector: 'app-media',
  standalone: true,
  imports: [CommonModule, SidebarComponent, TopbarComponent],
  template: `
    <div class="admin-layout">
      <app-topbar title="Media" class="admin-topbar"></app-topbar>
      <app-sidebar class="admin-sidebar"></app-sidebar>

      <main class="admin-content">
        <div class="page-header">
          <div class="page-header-row">
            <div>
              <h1 class="page-title">Media</h1>
              <p class="page-sub">{{ files().length }} files uploaded</p>
            </div>
            <label class="btn btn-primary upload-label">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/>
                <path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3"/>
              </svg>
              Upload Files
              <input type="file" accept="image/*" multiple (change)="onFileSelect($event)" style="display:none" />
            </label>
          </div>
        </div>

        <div class="page-body">
          <!-- Upload area -->
          <div
            class="drop-zone"
            [class.drag-over]="dragOver()"
            (dragover)="onDragOver($event)"
            (dragleave)="dragOver.set(false)"
            (drop)="onDrop($event)"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="color:rgba(255,255,255,0.2)">
              <polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/>
              <path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3"/>
            </svg>
            <div class="drop-text">Drag & drop images here</div>
            <div class="drop-sub">JPEG, PNG, WebP, GIF, SVG · Max 10MB each</div>
          </div>

          <!-- Uploading queue -->
          <div class="upload-queue" *ngIf="uploading().length > 0">
            <div class="upload-item" *ngFor="let u of uploading()">
              <div class="upload-item-name">{{ u.name }}</div>
              <div class="upload-progress">
                <div class="progress-bar" [style.width]="u.progress + '%'"></div>
              </div>
              <div class="upload-pct">{{ u.progress }}%</div>
            </div>
          </div>

          <!-- Media grid -->
          <div class="media-grid" *ngIf="files().length > 0">
            <div class="media-card" *ngFor="let f of files()">
              <div class="media-thumb">
                <img [src]="apiUrl + f.url" [alt]="f.filename" loading="lazy" />
                <div class="media-overlay">
                  <button class="media-copy" (click)="copyUrl(f.url)" title="Copy URL">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
                    </svg>
                    Copy URL
                  </button>
                </div>
              </div>
              <div class="media-info">
                <div class="media-name">{{ f.filename }}</div>
                <div class="media-size">{{ formatSize(f.size) }}</div>
              </div>
            </div>
          </div>

          <div class="empty-state" *ngIf="files().length === 0 && !loading()">
            <div class="empty-icon">🖼️</div>
            <p class="empty-title">No media yet</p>
            <p class="empty-sub">Upload images to use in your projects and stories</p>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .page-header-row { display: flex; justify-content: space-between; align-items: flex-start; }
    .upload-label { cursor: pointer; }

    .drop-zone {
      border: 1px dashed rgba(255,255,255,0.1);
      border-radius: 10px;
      padding: 2.5rem;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
      transition: all 0.2s ease;
      background: rgba(255,255,255,0.01);
    }
    .drop-zone.drag-over {
      border-color: rgba(212,0,26,0.4);
      background: rgba(212,0,26,0.04);
    }
    .drop-text { font-size: 0.9rem; color: rgba(255,255,255,0.4); font-weight: 500; }
    .drop-sub  { font-family: 'DM Mono', monospace; font-size: 0.65rem; letter-spacing: 0.1em; color: rgba(255,255,255,0.2); }

    /* Upload queue */
    .upload-queue { display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1.5rem; }
    .upload-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.06);
      border-radius: 6px;
      padding: 0.75rem 1rem;
    }
    .upload-item-name { font-size: 0.8rem; color: rgba(255,255,255,0.6); min-width: 200px; }
    .upload-progress {
      flex: 1;
      height: 3px;
      background: rgba(255,255,255,0.06);
      border-radius: 2px;
      overflow: hidden;
    }
    .progress-bar { height: 100%; background: #D4001A; border-radius: 2px; transition: width 0.3s ease; }
    .upload-pct { font-family: 'DM Mono', monospace; font-size: 0.65rem; color: rgba(255,255,255,0.3); min-width: 36px; text-align: right; }

    /* Media grid */
    .media-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: 1rem;
    }
    .media-card {
      background: #111;
      border: 1px solid rgba(255,255,255,0.06);
      border-radius: 8px;
      overflow: hidden;
      transition: all 0.2s ease;
    }
    .media-card:hover { border-color: rgba(255,255,255,0.12); }
    .media-thumb {
      position: relative;
      aspect-ratio: 4/3;
      overflow: hidden;
      background: rgba(255,255,255,0.03);
    }
    .media-thumb img { width: 100%; height: 100%; object-fit: cover; }
    .media-overlay {
      position: absolute;
      inset: 0;
      background: rgba(0,0,0,0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.2s ease;
    }
    .media-card:hover .media-overlay { opacity: 1; }
    .media-copy {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      background: rgba(255,255,255,0.1);
      border: 1px solid rgba(255,255,255,0.2);
      border-radius: 4px;
      padding: 0.4rem 0.75rem;
      color: #fff;
      font-size: 0.75rem;
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .media-copy:hover { background: rgba(255,255,255,0.15); }
    .media-info { padding: 0.75rem; }
    .media-name {
      font-size: 0.75rem;
      color: rgba(255,255,255,0.6);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-family: 'DM Mono', monospace;
    }
    .media-size { font-size: 0.65rem; color: rgba(255,255,255,0.25); font-family: 'DM Mono', monospace; margin-top: 0.2rem; }
  `]
})
export class MediaComponent implements OnInit {
  private api    = inject(AdminApiService);
  private toasts = inject(ToastService);

  files    = signal<MediaFile[]>([]);
  loading  = signal(true);
  dragOver = signal(false);
  uploading = signal<{ name: string; progress: number }[]>([]);

  apiUrl = environment.apiUrl;

  ngOnInit() { this.load(); }

  load() {
    this.api.listMedia().subscribe({
      next: f  => { this.files.set(f); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  onFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) this.uploadFiles(Array.from(input.files));
    input.value = '';
  }

  onDragOver(e: DragEvent) { e.preventDefault(); this.dragOver.set(true); }

  onDrop(e: DragEvent) {
    e.preventDefault();
    this.dragOver.set(false);
    if (e.dataTransfer?.files) this.uploadFiles(Array.from(e.dataTransfer.files));
  }

  uploadFiles(files: File[]) {
    files.forEach(file => {
      if (!file.type.startsWith('image/')) {
        this.toasts.show(`${file.name}: not an image.`, 'error');
        return;
      }
      const entry = { name: file.name, progress: 0 };
      this.uploading.update(u => [...u, entry]);

      // Simulate progress
      const interval = setInterval(() => {
        entry.progress = Math.min(entry.progress + 20, 90);
        this.uploading.update(u => [...u]);
      }, 150);

      this.api.uploadMedia(file).subscribe({
        next: () => {
          clearInterval(interval);
          entry.progress = 100;
          this.uploading.update(u => [...u]);
          setTimeout(() => {
            this.uploading.update(u => u.filter(x => x !== entry));
            this.load();
          }, 600);
          this.toasts.show(`${file.name} uploaded.`, 'success');
        },
        error: () => {
          clearInterval(interval);
          this.uploading.update(u => u.filter(x => x !== entry));
          this.toasts.show(`Failed to upload ${file.name}.`, 'error');
        }
      });
    });
  }

  copyUrl(url: string) {
    const full = `${this.apiUrl}${url}`;
    navigator.clipboard.writeText(full).then(() => {
      this.toasts.show('URL copied to clipboard.', 'success');
    });
  }

  formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
}
