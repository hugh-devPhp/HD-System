import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { TopbarComponent } from '../../components/topbar/topbar.component';
import { AdminApiService, Project } from '../../services/admin-api.service';
import { ToastService } from '../../services/toast.service';

const EMPTY_PROJECT = (): Project => ({
  title: '', description: '', tech_stack: [], github_link: '', live_demo_link: '',
  featured: false, images: [], order: 0
});

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent, TopbarComponent],
  template: `
    <div class="admin-layout">
      <app-topbar title="Projects" class="admin-topbar"></app-topbar>
      <app-sidebar class="admin-sidebar"></app-sidebar>

      <main class="admin-content">
        <div class="page-header">
          <div class="page-header-row">
            <div>
              <h1 class="page-title">Projects</h1>
              <p class="page-sub">{{ projects().length }} engineering projects</p>
            </div>
            <button class="btn btn-primary" (click)="openModal()">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              New Project
            </button>
          </div>

          <!-- Toolbar -->
          <div class="toolbar">
            <div class="search-bar">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input [(ngModel)]="search" placeholder="Search projects..." />
            </div>

            <div class="view-toggle">
              <button class="view-btn" [class.active]="view() === 'table'" (click)="view.set('table')">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
                </svg>
              </button>
              <button class="view-btn" [class.active]="view() === 'grid'" (click)="view.set('grid')">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                  <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div class="page-body">
          <!-- TABLE VIEW -->
          <div class="card table-wrap" *ngIf="view() === 'table'">
            <div *ngIf="filtered().length === 0" class="empty-state">
              <div class="empty-icon">⚙️</div>
              <p class="empty-title">No projects yet</p>
              <p class="empty-sub">Create your first engineering project</p>
              <button class="btn btn-primary" style="margin-top:1rem" (click)="openModal()">Add Project</button>
            </div>
            <table *ngIf="filtered().length > 0">
              <thead>
                <tr>
                  <th>Project</th>
                  <th>Tech Stack</th>
                  <th>Featured</th>
                  <th>Links</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let p of filtered()">
                  <td>
                    <div class="td-title">{{ p.title }}</div>
                    <div class="td-sub">{{ p.description | slice:0:60 }}{{ p.description.length > 60 ? '…' : '' }}</div>
                  </td>
                  <td>
                    <div class="tag-list">
                      <span class="tag-chip" *ngFor="let t of p.tech_stack.slice(0,3)">{{ t }}</span>
                      <span class="tag-chip more" *ngIf="p.tech_stack.length > 3">+{{ p.tech_stack.length - 3 }}</span>
                    </div>
                  </td>
                  <td>
                    <span class="badge" [class.badge-red]="p.featured" [class.badge-gray]="!p.featured">
                      {{ p.featured ? 'Featured' : 'Normal' }}
                    </span>
                  </td>
                  <td>
                    <div class="link-icons">
                      <a *ngIf="p.github_link" [href]="p.github_link" target="_blank" class="link-icon" title="GitHub">GH</a>
                      <a *ngIf="p.live_demo_link" [href]="p.live_demo_link" target="_blank" class="link-icon" title="Live">↗</a>
                    </div>
                  </td>
                  <td>
                    <div class="row-actions">
                      <button class="btn btn-ghost btn-sm btn-icon" (click)="editProject(p)" title="Edit">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                          <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                      </button>
                      <button class="btn btn-danger btn-sm btn-icon" (click)="confirmDelete(p)" title="Delete">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
                          <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- GRID VIEW -->
          <div class="project-grid" *ngIf="view() === 'grid'">
            <div class="add-card" (click)="openModal()">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              <span>New Project</span>
            </div>
            <div class="grid-card" *ngFor="let p of filtered()">
              <div class="grid-card-header">
                <span class="badge" [class.badge-red]="p.featured" [class.badge-gray]="!p.featured">
                  {{ p.featured ? 'Featured' : 'Active' }}
                </span>
                <div class="row-actions">
                  <button class="btn btn-ghost btn-sm btn-icon" (click)="editProject(p)">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                  </button>
                  <button class="btn btn-danger btn-sm btn-icon" (click)="confirmDelete(p)">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="3 6 5 6 21 6"/>
                      <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
                    </svg>
                  </button>
                </div>
              </div>
              <h3 class="grid-card-title">{{ p.title }}</h3>
              <p class="grid-card-desc">{{ p.description | slice:0:100 }}{{ p.description.length > 100 ? '…' : '' }}</p>
              <div class="tag-list" style="margin-top:auto; padding-top:.5rem">
                <span class="tag-chip" *ngFor="let t of p.tech_stack.slice(0,4)">{{ t }}</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- CREATE / EDIT MODAL -->
    <div class="modal-backdrop" *ngIf="modalOpen()" (click)="closeOnBackdrop($event)">
      <div class="modal" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <span class="modal-title">{{ editing() ? 'Edit Project' : 'New Project' }}</span>
          <button class="btn btn-ghost btn-icon" (click)="closeModal()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div class="modal-body">
          <div class="form-group">
            <label class="form-label">Title *</label>
            <input class="form-input" [(ngModel)]="form.title" placeholder="Project title" />
          </div>

          <div class="form-group">
            <label class="form-label">Description *</label>
            <textarea class="form-input" [(ngModel)]="form.description" placeholder="What does this project do?" rows="3"></textarea>
          </div>

          <div class="form-group">
            <label class="form-label">Tech Stack</label>
            <div class="tags-container" (click)="tagInput.focus()">
              <span class="tag-item" *ngFor="let tag of form.tech_stack">
                {{ tag }}
                <span class="tag-remove" (click)="removeTag(tag)">×</span>
              </span>
              <input
                #tagInput
                class="tag-input"
                placeholder="Add tech (press Enter)"
                (keydown.enter)="addTag($event)"
                (keydown.comma)="addTag($event)"
              />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">GitHub URL</label>
              <input class="form-input" [(ngModel)]="form.github_link" placeholder="https://github.com/..." />
            </div>
            <div class="form-group">
              <label class="form-label">Live Demo URL</label>
              <input class="form-input" [(ngModel)]="form.live_demo_link" placeholder="https://..." />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Order</label>
              <input class="form-input" type="number" [(ngModel)]="form.order" />
            </div>
            <div class="form-group">
              <label class="form-label">Featured</label>
              <div class="toggle-row">
                <label class="toggle">
                  <input type="checkbox" [(ngModel)]="form.featured" />
                  <span class="toggle-slider"></span>
                </label>
                <span class="toggle-label">{{ form.featured ? 'Yes — shown prominently' : 'No' }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-secondary" (click)="closeModal()">Cancel</button>
          <button class="btn btn-primary" (click)="saveProject()" [disabled]="saving()">
            {{ saving() ? 'Saving…' : (editing() ? 'Save Changes' : 'Create Project') }}
          </button>
        </div>
      </div>
    </div>

    <!-- DELETE CONFIRM -->
    <div class="modal-backdrop" *ngIf="deleteTarget()" (click)="deleteTarget.set(null)">
      <div class="modal" style="max-width:420px" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <span class="modal-title">Delete Project</span>
        </div>
        <div class="modal-body">
          <p style="color:rgba(255,255,255,0.6); font-size:0.875rem; line-height:1.6">
            Are you sure you want to delete <strong style="color:#fff">{{ deleteTarget()?.title }}</strong>?
            This cannot be undone.
          </p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" (click)="deleteTarget.set(null)">Cancel</button>
          <button class="btn btn-danger" (click)="deleteProject()">Delete</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-header-row { display: flex; justify-content: space-between; align-items: flex-start; }
    .toolbar { display: flex; gap: 0.75rem; align-items: center; margin-top: 1rem; flex-wrap: wrap; }

    .view-toggle { display: flex; gap: 2px; background: rgba(255,255,255,0.04); border-radius: 4px; padding: 2px; }
    .view-btn {
      display: flex; align-items: center; justify-content: center;
      padding: 0.35rem;
      background: none; border: none; border-radius: 3px;
      color: rgba(255,255,255,0.3); cursor: pointer;
      transition: all 0.15s ease;
    }
    .view-btn.active { background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.8); }

    /* Table */
    .td-title { font-size: 0.85rem; font-weight: 500; color: rgba(255,255,255,0.85); }
    .td-sub { font-size: 0.72rem; color: rgba(255,255,255,0.3); margin-top: 2px; }
    .tag-list { display: flex; gap: 0.3rem; flex-wrap: wrap; }
    .tag-chip {
      font-family: 'DM Mono', monospace;
      font-size: 0.62rem;
      color: rgba(255,255,255,0.4);
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.08);
      padding: 0.15rem 0.45rem;
      border-radius: 2px;
    }
    .tag-chip.more { color: rgba(212,0,26,0.7); border-color: rgba(212,0,26,0.2); background: rgba(212,0,26,0.06); }
    .link-icons { display: flex; gap: 0.5rem; }
    .link-icon {
      font-family: 'DM Mono', monospace;
      font-size: 0.65rem;
      color: rgba(255,255,255,0.3);
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.08);
      padding: 0.2rem 0.45rem;
      border-radius: 2px;
      transition: all 0.2s ease;
    }
    .link-icon:hover { color: #fff; border-color: rgba(255,255,255,0.2); }
    .row-actions { display: flex; gap: 0.3rem; }

    /* Grid */
    .project-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1rem;
    }
    .add-card {
      background: rgba(212,0,26,0.04);
      border: 1px dashed rgba(212,0,26,0.2);
      border-radius: 8px;
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      cursor: pointer;
      color: rgba(212,0,26,0.5);
      font-size: 0.8rem;
      min-height: 160px;
      transition: all 0.2s ease;
    }
    .add-card:hover { background: rgba(212,0,26,0.08); border-color: rgba(212,0,26,0.4); color: #D4001A; }
    .grid-card {
      background: #111;
      border: 1px solid rgba(255,255,255,0.06);
      border-radius: 8px;
      padding: 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      min-height: 160px;
      transition: all 0.2s ease;
    }
    .grid-card:hover { border-color: rgba(255,255,255,0.12); }
    .grid-card-header { display: flex; justify-content: space-between; align-items: center; }
    .grid-card-title { font-family: 'Bebas Neue', sans-serif; font-size: 1.3rem; letter-spacing: 0.03em; }
    .grid-card-desc { font-size: 0.78rem; color: rgba(255,255,255,0.4); line-height: 1.6; }

    /* Form */
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .toggle-row { display: flex; align-items: center; gap: 0.75rem; padding: 0.6rem 0; }
    .toggle-label { font-size: 0.8rem; color: rgba(255,255,255,0.5); }
  `]
})
export class ProjectsComponent implements OnInit {
  private api    = inject(AdminApiService);
  private toasts = inject(ToastService);
  private route  = inject(ActivatedRoute);

  projects   = signal<Project[]>([]);
  search     = '';
  view       = signal<'table' | 'grid'>('table');
  modalOpen  = signal(false);
  editing    = signal(false);
  saving     = signal(false);
  editId     = signal<number | null>(null);
  deleteTarget = signal<Project | null>(null);
  form: Project = EMPTY_PROJECT();

  filtered = computed(() => {
    const q = this.search.toLowerCase();
    return this.projects().filter(p =>
      !q || p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
    );
  });

  ngOnInit() {
    this.load();
    this.route.queryParams.subscribe(params => {
      if (params['new']) this.openModal();
    });
  }

  load() {
    this.api.getProjects().subscribe(p => this.projects.set(p));
  }

  openModal() {
    this.form = EMPTY_PROJECT();
    this.editing.set(false);
    this.editId.set(null);
    this.modalOpen.set(true);
  }

  editProject(p: Project) {
    this.form = { ...p };
    this.editing.set(true);
    this.editId.set(p.id!);
    this.modalOpen.set(true);
  }

  closeModal() { this.modalOpen.set(false); }
  closeOnBackdrop(e: Event) { if (e.target === e.currentTarget) this.closeModal(); }

  addTag(e: Event) {
    e.preventDefault();
    const input = e.target as HTMLInputElement;
    const val = input.value.trim().replace(/,$/, '');
    if (val && !this.form.tech_stack.includes(val)) {
      this.form.tech_stack = [...this.form.tech_stack, val];
    }
    input.value = '';
  }

  removeTag(tag: string) {
    this.form.tech_stack = this.form.tech_stack.filter(t => t !== tag);
  }

  saveProject() {
    if (!this.form.title || !this.form.description) {
      this.toasts.show('Title and description are required.', 'error');
      return;
    }
    this.saving.set(true);
    const call = this.editing()
      ? this.api.updateProject(this.editId()!, this.form)
      : this.api.createProject(this.form);
    call.subscribe({
      next: () => {
        this.toasts.show(this.editing() ? 'Project updated.' : 'Project created.', 'success');
        this.closeModal();
        this.saving.set(false);
        this.load();
      },
      error: () => {
        this.toasts.show('Something went wrong.', 'error');
        this.saving.set(false);
      }
    });
  }

  confirmDelete(p: Project) { this.deleteTarget.set(p); }

  deleteProject() {
    const p = this.deleteTarget();
    if (!p?.id) return;
    this.api.deleteProject(p.id).subscribe({
      next: () => {
        this.toasts.show('Project deleted.', 'success');
        this.deleteTarget.set(null);
        this.load();
      },
      error: () => this.toasts.show('Delete failed.', 'error')
    });
  }
}
