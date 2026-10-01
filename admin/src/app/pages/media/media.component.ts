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
  templateUrl: './media.component.html',
  styleUrls: ['./media.component.css']
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
