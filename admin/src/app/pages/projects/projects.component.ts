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
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
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
