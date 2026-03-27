import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Writing } from '../../services/portfolio-api.service';

@Component({
  selector: 'app-stories',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="stories" class="stories-section">
      <!-- Film strip decoration -->
      <div class="filmstrip top">
        <div class="frame" *ngFor="let f of frames">{{ f }}</div>
      </div>

      <div class="container">
        <div class="section-header">
          <div class="section-label">Storytelling</div>
          <h2 class="section-title">The Archive</h2>
          <p class="section-sub">A library of cinematic ideas, narratives, and worlds in development.</p>
        </div>

        <!-- Type filters -->
        <div class="type-filters">
          <button
            class="filter-btn"
            [class.active]="activeFilter() === 'all'"
            (click)="setFilter('all')"
          >All</button>
          <button
            class="filter-btn"
            *ngFor="let type of types"
            [class.active]="activeFilter() === type.value"
            (click)="setFilter(type.value)"
          >{{ type.label }}</button>
        </div>

        <!-- Writing grid -->
        <div class="stories-grid" *ngIf="filteredWritings.length > 0; else emptyState">
          <article
            class="story-card"
            *ngFor="let story of filteredWritings; let i = index"
            [style.animation-delay]="(i * 0.08) + 's'"
          >
            <!-- Type badge -->
            <div class="story-type" [ngClass]="story.type">
              {{ getTypeLabel(story.type) }}
            </div>

            <!-- Story meta -->
            <div class="story-meta">
              <span class="story-date">{{ story.created_at | date:'yyyy' }}</span>
              <span class="meta-dot"></span>
              <span class="story-status" [class.published]="story.status === 'published'">
                {{ story.status }}
              </span>
            </div>

            <h3 class="story-title">{{ story.title }}</h3>

            <p class="story-excerpt" *ngIf="story.excerpt">{{ story.excerpt }}</p>
            <p class="story-excerpt" *ngIf="!story.excerpt">
              {{ story.content | slice:0:140 }}{{ story.content.length > 140 ? '...' : '' }}
            </p>

            <!-- Read more hint -->
            <div class="story-footer">
              <span class="read-more">
                Read more
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </span>
            </div>
          </article>
        </div>

        <ng-template #emptyState>
          <div class="empty-state">
            <div class="empty-icon">📽</div>
            <p>No stories found in this category.</p>
          </div>
        </ng-template>
      </div>

      <div class="filmstrip bottom">
        <div class="frame" *ngFor="let f of frames">{{ f }}</div>
      </div>
    </section>
  `,
  styles: [`
    .stories-section {
      padding: 8rem 0;
      background: linear-gradient(to bottom, #0D0D0D, #080808);
      position: relative;
      overflow: hidden;
    }

    /* ─── FILMSTRIP ─── */
    .filmstrip {
      display: flex;
      gap: 0;
      overflow: hidden;
      position: relative;
    }
    .filmstrip.top  { margin-bottom: 4rem; border-bottom: 1px solid rgba(255,255,255,0.04); }
    .filmstrip.bottom { margin-top: 4rem; border-top: 1px solid rgba(255,255,255,0.04); }

    .frame {
      min-width: 80px;
      height: 48px;
      border-right: 1px solid rgba(255,255,255,0.04);
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'DM Mono', monospace;
      font-size: 0.55rem;
      color: rgba(255,255,255,0.08);
      letter-spacing: 0.1em;
      flex-shrink: 0;
    }

    /* ─── HEADER ─── */
    .section-header { margin-bottom: 3rem; }
    .section-title {
      font-family: 'Bebas Neue', sans-serif;
      font-size: clamp(2.5rem, 5vw, 4rem);
      margin-bottom: 0.75rem;
    }
    .section-sub {
      color: rgba(255,255,255,0.4);
      font-size: 0.95rem;
      font-weight: 300;
    }

    /* ─── FILTERS ─── */
    .type-filters {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 3rem;
      flex-wrap: wrap;
    }
    .filter-btn {
      font-family: 'DM Mono', monospace;
      font-size: 0.72rem;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: rgba(255,255,255,0.4);
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.08);
      padding: 0.4rem 1rem;
      border-radius: 2px;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .filter-btn:hover { color: #fff; border-color: rgba(255,255,255,0.2); }
    .filter-btn.active {
      color: #D4001A;
      background: rgba(212,0,26,0.08);
      border-color: rgba(212,0,26,0.3);
    }

    /* ─── GRID ─── */
    .stories-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 1.5rem;
    }

    /* ─── CARD ─── */
    .story-card {
      background: #111111;
      border: 1px solid rgba(255,255,255,0.06);
      border-radius: 8px;
      padding: 1.75rem;
      cursor: pointer;
      transition: all 0.3s ease;
      animation: fadeUp 0.6s ease forwards;
      opacity: 0;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    .story-card:hover {
      border-color: rgba(212,0,26,0.2);
      transform: translateY(-3px);
      box-shadow: 0 16px 48px rgba(0,0,0,0.4);
    }

    /* Type badge */
    .story-type {
      display: inline-block;
      font-family: 'DM Mono', monospace;
      font-size: 0.65rem;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      padding: 0.2rem 0.6rem;
      border-radius: 2px;
      align-self: flex-start;
    }
    .story-type.film_idea { color: #D4001A; background: rgba(212,0,26,0.1); border: 1px solid rgba(212,0,26,0.2); }
    .story-type.script    { color: #fff;    background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); }
    .story-type.synopsis  { color: #aaa;    background: rgba(170,170,170,0.05); border: 1px solid rgba(170,170,170,0.1); }
    .story-type.article   { color: #7eb8ff; background: rgba(126,184,255,0.05); border: 1px solid rgba(126,184,255,0.1); }

    /* Meta */
    .story-meta {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-family: 'DM Mono', monospace;
      font-size: 0.68rem;
      color: rgba(255,255,255,0.25);
    }
    .meta-dot {
      width: 3px; height: 3px;
      background: rgba(255,255,255,0.2);
      border-radius: 50%;
    }
    .story-status.published { color: rgba(100,200,100,0.6); }

    .story-title {
      font-family: 'Bebas Neue', sans-serif;
      font-size: 1.5rem;
      letter-spacing: 0.03em;
      color: #fff;
      line-height: 1.1;
    }
    .story-excerpt {
      font-size: 0.85rem;
      color: rgba(255,255,255,0.45);
      line-height: 1.7;
      font-weight: 300;
      flex: 1;
    }

    .story-footer { margin-top: auto; padding-top: 0.5rem; }
    .read-more {
      font-family: 'DM Mono', monospace;
      font-size: 0.7rem;
      letter-spacing: 0.1em;
      color: #D4001A;
      display: flex;
      align-items: center;
      gap: 0.4rem;
      transition: gap 0.2s ease;
    }
    .story-card:hover .read-more { gap: 0.7rem; }

    .empty-state {
      text-align: center;
      color: rgba(255,255,255,0.3);
      padding: 4rem;
      font-size: 0.9rem;
    }
    .empty-icon { font-size: 2rem; margin-bottom: 1rem; }

    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(12px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    @media (max-width: 768px) {
      .stories-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class StoriesComponent {
  @Input() set writings(val: Writing[]) {
    this._writings = val;
  }
  get writings() { return this._writings; }
  private _writings: Writing[] = [];

  activeFilter = signal<string>('all');

  types = [
    { value: 'film_idea', label: 'Film Ideas' },
    { value: 'script',    label: 'Scripts' },
    { value: 'synopsis',  label: 'Synopses' },
    { value: 'article',   label: 'Articles' },
  ];

  frames = Array.from({ length: 20 }, (_, i) => String(i + 1).padStart(4, '0'));

  get filteredWritings(): Writing[] {
    const f = this.activeFilter();
    return f === 'all' ? this._writings : this._writings.filter(w => w.type === f);
  }

  setFilter(type: string) { this.activeFilter.set(type); }

  getTypeLabel(type: string): string {
    return this.types.find(t => t.value === type)?.label.replace(/s$/, '') ?? type;
  }
}
