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
  template: `
    <div class="admin-layout">
      <app-topbar title="Writing" class="admin-topbar"></app-topbar>
      <app-sidebar class="admin-sidebar"></app-sidebar>

      <main class="admin-content">
        <div class="page-header">
          <div class="page-header-row">
            <div>
              <h1 class="page-title">Writing</h1>
              <p class="page-sub">{{ writings().length }} stories & articles</p>
            </div>
            <button class="btn btn-primary" (click)="openModal()">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              New Story
            </button>
          </div>

          <div class="toolbar">
            <div class="search-bar">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input [(ngModel)]="search" placeholder="Search stories..." />
            </div>

            <div class="filter-chips">
              <button class="filter-chip" [class.active]="typeFilter() === ''" (click)="typeFilter.set('')">All</button>
              <button class="filter-chip" *ngFor="let t of types" [class.active]="typeFilter() === t.value" (click)="typeFilter.set(t.value)">
                {{ t.label }}
              </button>
            </div>

            <div class="filter-chips" style="margin-left:auto">
              <button class="filter-chip" [class.active]="statusFilter() === ''" (click)="statusFilter.set('')">All Status</button>
              <button class="filter-chip" [class.active]="statusFilter() === 'published'" (click)="statusFilter.set('published')">Published</button>
              <button class="filter-chip" [class.active]="statusFilter() === 'draft'" (click)="statusFilter.set('draft')">Draft</button>
            </div>
          </div>
        </div>

        <div class="page-body">
          <div class="card table-wrap">
            <div *ngIf="filtered().length === 0" class="empty-state">
              <div class="empty-icon">🎬</div>
              <p class="empty-title">No stories yet</p>
              <p class="empty-sub">Start your first screenplay, film idea, or article</p>
              <button class="btn btn-primary" style="margin-top:1rem" (click)="openModal()">New Story</button>
            </div>
            <table *ngIf="filtered().length > 0">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Featured</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let w of filtered()">
                  <td>
                    <div class="td-title">{{ w.title }}</div>
                    <div class="td-sub" *ngIf="w.excerpt">{{ w.excerpt | slice:0:70 }}{{ (w.excerpt && w.excerpt.length > 70) ? '…' : '' }}</div>
                  </td>
                  <td>
                    <span class="type-badge" [ngClass]="w.type">{{ getTypeLabel(w.type) }}</span>
                  </td>
                  <td>
                    <span class="badge" [class.badge-green]="w.status==='published'" [class.badge-gray]="w.status==='draft'">
                      {{ w.status }}
                    </span>
                  </td>
                  <td>
                    <span class="badge" [class.badge-red]="w.featured" [class.badge-gray]="!w.featured">
                      {{ w.featured ? 'Yes' : 'No' }}
                    </span>
                  </td>
                  <td class="td-date">{{ w.created_at | date:'MMM d, y' }}</td>
                  <td>
                    <div class="row-actions">
                      <button class="btn btn-ghost btn-sm btn-icon" (click)="editWriting(w)" title="Edit">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                          <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                      </button>
                      <button
                        class="btn btn-ghost btn-sm"
                        style="font-size:0.7rem"
                        (click)="toggleStatus(w)"
                        title="Toggle status"
                      >
                        {{ w.status === 'draft' ? '→ Publish' : '→ Draft' }}
                      </button>
                      <button class="btn btn-danger btn-sm btn-icon" (click)="confirmDelete(w)" title="Delete">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <polyline points="3 6 5 6 21 6"/>
                          <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>

    <!-- MODAL -->
    <div class="modal-backdrop" *ngIf="modalOpen()" (click)="closeOnBackdrop($event)">
      <div class="modal modal-large" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <span class="modal-title">{{ editing() ? 'Edit Story' : 'New Story' }}</span>
          <button class="btn btn-ghost btn-icon" (click)="closeModal()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div class="modal-body">
          <div class="form-row-3">
            <div class="form-group" style="flex:2">
              <label class="form-label">Title *</label>
              <input class="form-input" [(ngModel)]="form.title" placeholder="Story title" />
            </div>
            <div class="form-group">
              <label class="form-label">Type</label>
              <select class="form-input" [(ngModel)]="form.type">
                <option *ngFor="let t of types" [value]="t.value">{{ t.label }}</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Status</label>
              <select class="form-input" [(ngModel)]="form.status">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Excerpt / Logline</label>
            <textarea class="form-input" [(ngModel)]="form.excerpt" placeholder="One-sentence hook or logline..." rows="2"></textarea>
          </div>

          <div class="form-group">
            <label class="form-label">Content</label>
            <div class="editor-toolbar">
              <button type="button" class="editor-btn" (click)="insertMarkdown('**', '**')"><strong>B</strong></button>
              <button type="button" class="editor-btn" (click)="insertMarkdown('*', '*')"><em>I</em></button>
              <button type="button" class="editor-btn" (click)="insertMarkdown('\n# ', '')">H1</button>
              <button type="button" class="editor-btn" (click)="insertMarkdown('\n## ', '')">H2</button>
              <button type="button" class="editor-btn" (click)="insertMarkdown('\n- ', '')">List</button>
              <span class="editor-hint">Markdown supported</span>
            </div>
            <textarea
              #contentArea
              class="form-input content-editor"
              [(ngModel)]="form.content"
              placeholder="Write your story, script, or article here... Markdown is supported."
              rows="16"
            ></textarea>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Cover Image URL</label>
              <input class="form-input" [(ngModel)]="form.cover_image" placeholder="https://..." />
            </div>
            <div class="form-group">
              <label class="form-label">Order</label>
              <input class="form-input" type="number" [(ngModel)]="form.order" />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Featured</label>
            <div class="toggle-row">
              <label class="toggle">
                <input type="checkbox" [(ngModel)]="form.featured" />
                <span class="toggle-slider"></span>
              </label>
              <span class="toggle-label">{{ form.featured ? 'Featured — shown prominently in portfolio' : 'Not featured' }}</span>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-secondary" (click)="closeModal()">Cancel</button>
          <button class="btn btn-primary" (click)="saveWriting()" [disabled]="saving()">
            {{ saving() ? 'Saving…' : (editing() ? 'Save Changes' : 'Create Story') }}
          </button>
        </div>
      </div>
    </div>

    <!-- DELETE CONFIRM -->
    <div class="modal-backdrop" *ngIf="deleteTarget()" (click)="deleteTarget.set(null)">
      <div class="modal" style="max-width:420px" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <span class="modal-title">Delete Story</span>
        </div>
        <div class="modal-body">
          <p style="color:rgba(255,255,255,0.6); font-size:0.875rem; line-height:1.6">
            Delete <strong style="color:#fff">{{ deleteTarget()?.title }}</strong>? This cannot be undone.
          </p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" (click)="deleteTarget.set(null)">Cancel</button>
          <button class="btn btn-danger" (click)="deleteWriting()">Delete</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-header-row { display: flex; justify-content: space-between; align-items: flex-start; }
    .toolbar { display: flex; gap: 0.75rem; align-items: center; margin-top: 1rem; flex-wrap: wrap; }
    .filter-chips { display: flex; gap: 0.25rem; }
    .filter-chip {
      font-family: 'DM Mono', monospace;
      font-size: 0.65rem;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      padding: 0.25rem 0.7rem;
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.06);
      border-radius: 2px;
      color: rgba(255,255,255,0.35);
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .filter-chip:hover { color: rgba(255,255,255,0.7); }
    .filter-chip.active { background: rgba(212,0,26,0.08); border-color: rgba(212,0,26,0.25); color: #D4001A; }
    .td-title { font-size: 0.85rem; font-weight: 500; color: rgba(255,255,255,0.85); }
    .td-sub { font-size: 0.72rem; color: rgba(255,255,255,0.3); margin-top: 2px; }
    .td-date { font-family: 'DM Mono', monospace; font-size: 0.72rem; color: rgba(255,255,255,0.3); }
    .row-actions { display: flex; gap: 0.3rem; align-items: center; }

    .type-badge {
      font-family: 'DM Mono', monospace;
      font-size: 0.62rem;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      padding: 0.2rem 0.5rem;
      border-radius: 2px;
    }
    .type-badge.film_idea { color: #D4001A; background: rgba(212,0,26,0.1); }
    .type-badge.script    { color: rgba(255,255,255,0.7); background: rgba(255,255,255,0.06); }
    .type-badge.synopsis  { color: rgba(180,180,180,0.8); background: rgba(180,180,180,0.06); }
    .type-badge.article   { color: rgba(126,184,255,0.9); background: rgba(126,184,255,0.06); }

    /* Form */
    .form-row   { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .form-row-3 { display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 1rem; }
    .toggle-row { display: flex; align-items: center; gap: 0.75rem; padding: 0.6rem 0; }
    .toggle-label { font-size: 0.8rem; color: rgba(255,255,255,0.5); }

    /* Editor */
    .editor-toolbar {
      display: flex;
      gap: 0.25rem;
      align-items: center;
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.06);
      border-bottom: none;
      border-radius: 4px 4px 0 0;
      padding: 0.4rem 0.6rem;
    }
    .editor-btn {
      background: none;
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 3px;
      padding: 0.2rem 0.55rem;
      color: rgba(255,255,255,0.5);
      font-size: 0.8rem;
      cursor: pointer;
      transition: all 0.15s;
    }
    .editor-btn:hover { background: rgba(255,255,255,0.08); color: #fff; }
    .editor-hint {
      margin-left: auto;
      font-family: 'DM Mono', monospace;
      font-size: 0.62rem;
      letter-spacing: 0.1em;
      color: rgba(255,255,255,0.2);
    }
    .content-editor {
      border-radius: 0 0 4px 4px;
      font-family: 'DM Mono', monospace;
      font-size: 0.82rem;
      line-height: 1.8;
      min-height: 320px;
    }

    .modal-large { max-width: 800px; }
  `]
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
