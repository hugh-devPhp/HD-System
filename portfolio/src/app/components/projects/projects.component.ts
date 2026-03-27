import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Project } from '../../services/portfolio-api.service';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="projects" class="projects-section">
      <div class="container">
        <div class="section-header">
          <div class="section-label">Engineering</div>
          <h2 class="section-title">Selected Projects</h2>
          <p class="section-sub">Systems built with intention. Problems solved with craft.</p>
        </div>

        <div class="projects-grid" *ngIf="projects.length > 0; else emptyState">
          <div
            class="project-card"
            *ngFor="let project of projects; let i = index"
            [class.featured]="project.featured"
            [style.animation-delay]="(i * 0.1) + 's'"
          >
            <!-- Featured badge -->
            <div class="project-badge" *ngIf="project.featured">
              <span>Featured</span>
            </div>

            <!-- Card header -->
            <div class="project-header">
              <div class="project-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
                </svg>
              </div>
              <div class="project-links">
                <a *ngIf="project.github_link" [href]="project.github_link" target="_blank" class="icon-link" title="GitHub">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
                <a *ngIf="project.live_demo_link" [href]="project.live_demo_link" target="_blank" class="icon-link" title="Live Demo">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
                    <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                  </svg>
                </a>
              </div>
            </div>

            <!-- Content -->
            <h3 class="project-title">{{ project.title }}</h3>
            <p class="project-desc">{{ project.description }}</p>

            <!-- Tech stack -->
            <div class="tech-stack">
              <span class="tech-tag" *ngFor="let tech of project.tech_stack">{{ tech }}</span>
            </div>

            <!-- Hover line -->
            <div class="card-line"></div>
          </div>
        </div>

        <ng-template #emptyState>
          <div class="empty-state">
            <p>Projects loading...</p>
          </div>
        </ng-template>
      </div>
    </section>
  `,
  styles: [`
    .projects-section {
      padding: 8rem 0;
      background: #0D0D0D;
      position: relative;
    }

    .section-header {
      margin-bottom: 4rem;
    }
    .section-title {
      font-family: 'Bebas Neue', sans-serif;
      font-size: clamp(2.5rem, 5vw, 4rem);
      color: #fff;
      margin-bottom: 0.75rem;
    }
    .section-sub {
      color: rgba(255,255,255,0.4);
      font-size: 0.95rem;
      font-weight: 300;
    }

    .projects-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
      gap: 1.5rem;
    }

    .project-card {
      position: relative;
      background: #111111;
      border: 1px solid rgba(255,255,255,0.06);
      border-radius: 8px;
      padding: 1.75rem;
      transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
      overflow: hidden;
      animation: fadeUp 0.6s ease forwards;
      opacity: 0;
    }
    .project-card:hover {
      border-color: rgba(212,0,26,0.25);
      transform: translateY(-4px);
      box-shadow: 0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(212,0,26,0.1);
    }
    .project-card.featured {
      border-color: rgba(212,0,26,0.15);
    }
    .project-card:hover .card-line {
      transform: scaleX(1);
    }

    .card-line {
      position: absolute;
      bottom: 0; left: 0; right: 0;
      height: 2px;
      background: linear-gradient(90deg, #D4001A, transparent);
      transform: scaleX(0);
      transform-origin: left;
      transition: transform 0.4s ease;
    }

    .project-badge {
      position: absolute;
      top: 1rem; right: 1rem;
    }
    .project-badge span {
      font-family: 'DM Mono', monospace;
      font-size: 0.65rem;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: #D4001A;
      background: rgba(212,0,26,0.1);
      border: 1px solid rgba(212,0,26,0.2);
      padding: 0.2rem 0.6rem;
      border-radius: 2px;
    }

    .project-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.25rem;
    }
    .project-icon {
      width: 36px; height: 36px;
      display: flex; align-items: center; justify-content: center;
      background: rgba(212,0,26,0.08);
      border-radius: 4px;
      color: #D4001A;
    }
    .project-links {
      display: flex;
      gap: 0.75rem;
    }
    .icon-link {
      color: rgba(255,255,255,0.3);
      transition: color 0.2s ease;
      display: flex; align-items: center;
    }
    .icon-link:hover { color: #fff; }

    .project-title {
      font-family: 'Bebas Neue', sans-serif;
      font-size: 1.6rem;
      letter-spacing: 0.03em;
      color: #fff;
      margin-bottom: 0.75rem;
    }
    .project-desc {
      font-size: 0.875rem;
      color: rgba(255,255,255,0.5);
      line-height: 1.7;
      margin-bottom: 1.5rem;
      font-weight: 300;
    }

    .tech-stack {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }
    .tech-tag {
      font-family: 'DM Mono', monospace;
      font-size: 0.68rem;
      letter-spacing: 0.08em;
      color: rgba(255,255,255,0.45);
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.08);
      padding: 0.25rem 0.6rem;
      border-radius: 2px;
    }

    .empty-state {
      text-align: center;
      color: rgba(255,255,255,0.3);
      padding: 4rem;
    }

    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(16px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    @media (max-width: 768px) {
      .projects-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class ProjectsComponent {
  @Input() projects: Project[] = [];
}
