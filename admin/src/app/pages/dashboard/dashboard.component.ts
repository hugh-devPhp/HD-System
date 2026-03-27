import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { TopbarComponent } from '../../components/topbar/topbar.component';
import { AdminApiService } from '../../services/admin-api.service';
import { forkJoin, catchError, of } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, SidebarComponent, TopbarComponent],
  template: `
    <div class="admin-layout">
      <app-topbar title="Overview" class="admin-topbar"></app-topbar>
      <app-sidebar class="admin-sidebar"></app-sidebar>

      <main class="admin-content">
        <div class="page-header">
          <h1 class="page-title">Dashboard</h1>
          <p class="page-sub">Your creative control center</p>
        </div>

        <div class="page-body">
          <!-- Stats grid -->
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
                </svg>
              </div>
              <div class="stat-value">{{ projectCount() }}</div>
              <div class="stat-label">Projects</div>
            </div>

            <div class="stat-card">
              <div class="stat-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
                </svg>
              </div>
              <div class="stat-value">{{ writingCount() }}</div>
              <div class="stat-label">Writing Entries</div>
            </div>

            <div class="stat-card red">
              <div class="stat-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
              </div>
              <div class="stat-value">{{ featuredCount() }}</div>
              <div class="stat-label">Featured Items</div>
            </div>

            <div class="stat-card">
              <div class="stat-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                </svg>
              </div>
              <div class="stat-value">{{ publishedCount() }}</div>
              <div class="stat-label">Published Stories</div>
            </div>
          </div>

          <!-- Quick actions -->
          <div class="section-block">
            <div class="section-block-title">Quick Actions</div>
            <div class="quick-actions">
              <button class="action-card" (click)="router.navigate(['/projects'], { queryParams: { new: true } })">
                <div class="action-icon red">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                </div>
                <div class="action-label">New Project</div>
                <div class="action-sub">Add engineering work</div>
              </button>

              <button class="action-card" (click)="router.navigate(['/writing'], { queryParams: { new: true } })">
                <div class="action-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                </div>
                <div class="action-label">New Story</div>
                <div class="action-sub">Film idea, script, synopsis</div>
              </button>

              <button class="action-card" (click)="router.navigate(['/homepage'])">
                <div class="action-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                </div>
                <div class="action-label">Edit Homepage</div>
                <div class="action-sub">Update hero & about</div>
              </button>

              <button class="action-card" (click)="router.navigate(['/media'])">
                <div class="action-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21 15 16 10 5 21"/>
                  </svg>
                </div>
                <div class="action-label">Upload Media</div>
                <div class="action-sub">Images &amp; assets</div>
              </button>
            </div>
          </div>

          <!-- Recent activity -->
          <div class="two-col">
            <!-- Recent projects -->
            <div class="section-block">
              <div class="section-block-header">
                <div class="section-block-title">Recent Projects</div>
                <button class="btn btn-ghost btn-sm" (click)="router.navigate(['/projects'])">View all →</button>
              </div>
              <div class="card">
                <div *ngIf="recentProjects().length === 0" class="empty-state">
                  <div class="empty-icon">⚙️</div>
                  <p class="empty-title">No projects yet</p>
                  <p class="empty-sub">Add your first engineering project</p>
                </div>
                <div class="mini-list" *ngIf="recentProjects().length > 0">
                  <div class="mini-item" *ngFor="let p of recentProjects()">
                    <div class="mini-dot" [class.red]="p.featured"></div>
                    <div class="mini-info">
                      <div class="mini-title">{{ p.title }}</div>
                      <div class="mini-tags">
                        <span class="mini-tag" *ngFor="let t of p.tech_stack.slice(0,3)">{{ t }}</span>
                      </div>
                    </div>
                    <span class="badge" [class.badge-red]="p.featured" [class.badge-gray]="!p.featured">
                      {{ p.featured ? 'Featured' : 'Active' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Recent writing -->
            <div class="section-block">
              <div class="section-block-header">
                <div class="section-block-title">Recent Stories</div>
                <button class="btn btn-ghost btn-sm" (click)="router.navigate(['/writing'])">View all →</button>
              </div>
              <div class="card">
                <div *ngIf="recentWriting().length === 0" class="empty-state">
                  <div class="empty-icon">🎬</div>
                  <p class="empty-title">No stories yet</p>
                  <p class="empty-sub">Start your first screenplay or article</p>
                </div>
                <div class="mini-list" *ngIf="recentWriting().length > 0">
                  <div class="mini-item" *ngFor="let w of recentWriting()">
                    <div class="mini-type-dot" [ngClass]="w.type"></div>
                    <div class="mini-info">
                      <div class="mini-title">{{ w.title }}</div>
                      <div class="mini-sub">{{ getTypeLabel(w.type) }}</div>
                    </div>
                    <span class="badge" [class.badge-green]="w.status==='published'" [class.badge-gray]="w.status==='draft'">
                      {{ w.status }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  `,
  styles: [`
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1rem;
      margin-bottom: 2rem;
    }
    @media (max-width: 1100px) { .stats-grid { grid-template-columns: repeat(2,1fr); } }

    .section-block { margin-bottom: 1.5rem; }
    .section-block-title {
      font-size: 0.78rem;
      font-weight: 600;
      color: rgba(255,255,255,0.5);
      letter-spacing: 0.08em;
      text-transform: uppercase;
      margin-bottom: 0.75rem;
      font-family: 'DM Mono', monospace;
    }
    .section-block-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.75rem;
    }
    .section-block-header .section-block-title { margin-bottom: 0; }

    /* Quick actions */
    .quick-actions {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 0.75rem;
    }
    @media (max-width: 1100px) { .quick-actions { grid-template-columns: repeat(2,1fr); } }

    .action-card {
      background: #111111;
      border: 1px solid rgba(255,255,255,0.06);
      border-radius: 8px;
      padding: 1.25rem;
      text-align: left;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .action-card:hover {
      border-color: rgba(255,255,255,0.12);
      background: #161616;
      transform: translateY(-1px);
    }
    .action-icon {
      width: 34px; height: 34px;
      display: flex; align-items: center; justify-content: center;
      background: rgba(255,255,255,0.04);
      border-radius: 6px;
      color: rgba(255,255,255,0.5);
      margin-bottom: 0.25rem;
    }
    .action-icon.red { background: rgba(212,0,26,0.1); color: #D4001A; }
    .action-label { font-size: 0.875rem; font-weight: 500; color: rgba(255,255,255,0.85); }
    .action-sub { font-size: 0.75rem; color: rgba(255,255,255,0.3); }

    /* Two column layout */
    .two-col {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
    }
    @media (max-width: 900px) { .two-col { grid-template-columns: 1fr; } }

    /* Mini list */
    .mini-list { display: flex; flex-direction: column; }
    .mini-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.875rem 1rem;
      border-bottom: 1px solid rgba(255,255,255,0.03);
      transition: background 0.15s ease;
    }
    .mini-item:last-child { border-bottom: none; }
    .mini-item:hover { background: rgba(255,255,255,0.02); }

    .mini-dot {
      width: 6px; height: 6px;
      border-radius: 50%;
      background: rgba(255,255,255,0.15);
      flex-shrink: 0;
    }
    .mini-dot.red { background: #D4001A; }

    .mini-type-dot {
      width: 6px; height: 6px;
      border-radius: 50%;
      flex-shrink: 0;
    }
    .mini-type-dot.film_idea { background: #D4001A; }
    .mini-type-dot.script    { background: #fff; }
    .mini-type-dot.synopsis  { background: #aaa; }
    .mini-type-dot.article   { background: #7eb8ff; }

    .mini-info { flex: 1; min-width: 0; }
    .mini-title {
      font-size: 0.82rem;
      color: rgba(255,255,255,0.8);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .mini-tags { display: flex; gap: 0.3rem; margin-top: 0.15rem; flex-wrap: wrap; }
    .mini-tag {
      font-family: 'DM Mono', monospace;
      font-size: 0.6rem;
      color: rgba(255,255,255,0.3);
      background: rgba(255,255,255,0.04);
      padding: 0.1rem 0.4rem;
      border-radius: 2px;
    }
    .mini-sub {
      font-size: 0.72rem;
      color: rgba(255,255,255,0.3);
      font-family: 'DM Mono', monospace;
      letter-spacing: 0.05em;
      margin-top: 0.15rem;
    }
  `]
})
export class DashboardComponent implements OnInit {
  private api = inject(AdminApiService);
  router = inject(Router);

  projectCount  = signal(0);
  writingCount  = signal(0);
  featuredCount = signal(0);
  publishedCount = signal(0);
  recentProjects = signal<any[]>([]);
  recentWriting  = signal<any[]>([]);

  ngOnInit() {
    forkJoin({
      projects: this.api.getProjects().pipe(catchError(() => of([]))),
      writings: this.api.getWritings().pipe(catchError(() => of([]))),
    }).subscribe(({ projects, writings }) => {
      this.projectCount.set(projects.length);
      this.writingCount.set(writings.length);
      this.featuredCount.set(
        projects.filter((p: any) => p.featured).length +
        writings.filter((w: any) => w.featured).length
      );
      this.publishedCount.set(writings.filter((w: any) => w.status === 'published').length);
      this.recentProjects.set(projects.slice(0, 4));
      this.recentWriting.set(writings.slice(0, 4));
    });
  }

  getTypeLabel(type: string): string {
    const map: Record<string, string> = {
      film_idea: 'Film Idea', script: 'Script', synopsis: 'Synopsis', article: 'Article'
    };
    return map[type] ?? type;
  }
}
