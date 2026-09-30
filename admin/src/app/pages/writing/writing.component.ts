import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { TopbarComponent } from '../../components/topbar/topbar.component';
import { AdminApiService, Writing } from '../../services/admin-api.service';
import { ToastService } from '../../services/toast.service';

const EMPTY_WRITING = (): Writing => ({
  title: '', type: 'film_idea', content: '', excerpt: '',
  status: 'draft', featured: false, cover_image: '', order: 0
});

@Component({
  selector: 'app-writing',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent, TopbarComponent],
  templateUrl: './writing.component.html',
  styleUrls: ['./writing.component.css']
})
export class WritingComponent implements OnInit {
  private api = inject(AdminApiService);
  private toasts = inject(ToastService);
  private route = inject(ActivatedRoute);

  writings = signal<Writing[]>([]);
  search = '';
  typeFilter = signal('');
  statusFilter = signal('');
  modalOpen = signal(false);
  editing = signal(false);
  saving = signal(false);
  editId = signal<number | null>(null);
  deleteTarget = signal<Writing | null>(null);
  form: Writing = EMPTY_WRITING();

  types = [
    { value: 'film_idea', label: 'Film Idea' },
    { value: 'script', label: 'Script' },
    { value: 'synopsis', label: 'Synopsis' },
    { value: 'article', label: 'Article' },
  ];

  filtered = computed(() => {
    const q = this.search.toLowerCase();
    const tf = this.typeFilter();
    const sf = this.statusFilter();
    return this.writings().filter(w =>
      (!q || w.title.toLowerCase().includes(q)) &&
      (!tf || w.type === tf) &&
      (!sf || w.status === sf)
    );
  });

  ngOnInit() {
    this.load();
    this.route.queryParams.subscribe(p => { if (p['new']) this.openModal(); });
  }

  load() { this.api.getWritings().subscribe(w => this.writings.set(w)); }

  openModal() { this.form = EMPTY_WRITING(); this.editing.set(false); this.editId.set(null); this.modalOpen.set(true); }
  editWriting(w: Writing) { this.form = { ...w }; this.editing.set(true); this.editId.set(w.id!); this.modalOpen.set(true); }
  closeModal() { this.modalOpen.set(false); }
  closeOnBackdrop(e: Event) { if (e.target === e.currentTarget) this.closeModal(); }

  insertMarkdown(before: string, after: string) {
    const ta = document.querySelector('.content-editor') as HTMLTextAreaElement;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const sel = this.form.content.substring(start, end);
    this.form.content = this.form.content.substring(0, start) + before + sel + after + this.form.content.substring(end);
    setTimeout(() => { ta.focus(); ta.setSelectionRange(start + before.length, start + before.length + sel.length); });
  }

  toggleStatus(w: Writing) {
    const newStatus = w.status === 'draft' ? 'published' : 'draft';
    this.api.updateWriting(w.id!, { status: newStatus }).subscribe({
      next: () => { this.toasts.show(`Moved to ${newStatus}.`, 'success'); this.load(); },
      error: () => this.toasts.show('Update failed.', 'error')
    });
  }

  saveWriting() {
    if (!this.form.title || !this.form.content) {
      this.toasts.show('Title and content are required.', 'error');
      return;
    }
    this.saving.set(true);
    const call = this.editing()
      ? this.api.updateWriting(this.editId()!, this.form)
      : this.api.createWriting(this.form);
    call.subscribe({
      next: () => {
        this.toasts.show(this.editing() ? 'Story updated.' : 'Story created.', 'success');
        this.closeModal(); this.saving.set(false); this.load();
      },
      error: () => { this.toasts.show('Something went wrong.', 'error'); this.saving.set(false); }
    });
  }

  confirmDelete(w: Writing) { this.deleteTarget.set(w); }

  deleteWriting() {
    const w = this.deleteTarget();
    if (!w?.id) return;
    this.api.deleteWriting(w.id).subscribe({
      next: () => { this.toasts.show('Story deleted.', 'success'); this.deleteTarget.set(null); this.load(); },
      error: () => this.toasts.show('Delete failed.', 'error')
    });
  }

  getTypeLabel(type: string): string {
    return this.types.find(t => t.value === type)?.label ?? type;
  }
}
