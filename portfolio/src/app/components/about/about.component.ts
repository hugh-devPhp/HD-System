import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="about" class="about-section">
      <div class="container">
        <div class="about-grid">
          <!-- Left: identity blocks -->
          <div class="about-identity">
            <div class="section-label">Identity</div>

            <div class="identity-card engineer">
              <div class="identity-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
                </svg>
              </div>
              <div>
                <div class="identity-label">Software Engineer</div>
                <div class="identity-desc">Systems, APIs, clean architecture</div>
              </div>
            </div>

            <div class="identity-slash">/</div>

            <div class="identity-card writer">
              <div class="identity-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
                </svg>
              </div>
              <div>
                <div class="identity-label">Screenwriter</div>
                <div class="identity-desc">Film ideas, scripts, narratives</div>
              </div>
            </div>

            <div class="about-stats">
              <div class="stat">
                <div class="stat-value">∞</div>
                <div class="stat-label">Stories in progress</div>
              </div>
              <div class="stat-divider"></div>
              <div class="stat">
                <div class="stat-value">01</div>
                <div class="stat-label">Universe</div>
              </div>
            </div>
          </div>

          <!-- Right: narrative text -->
          <div class="about-narrative">
            <p class="narrative-text" [innerHTML]="formattedText"></p>

            <div class="about-quote">
              <div class="quote-bar"></div>
              <blockquote>
                Every system tells a story.<br/>Every story follows a system.
              </blockquote>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .about-section {
      padding: 8rem 0;
      background: linear-gradient(to bottom, #080808, #0D0D0D);
      position: relative;
    }
    .about-section::before {
      content: 'ABOUT';
      position: absolute;
      top: 4rem;
      right: -1rem;
      font-family: 'Bebas Neue', sans-serif;
      font-size: 12rem;
      color: rgba(255,255,255,0.02);
      letter-spacing: 0.05em;
      pointer-events: none;
      user-select: none;
    }

    .about-grid {
      display: grid;
      grid-template-columns: 1fr 1.6fr;
      gap: 6rem;
      align-items: start;
    }

    /* ─── IDENTITY ─── */
    .about-identity { display: flex; flex-direction: column; gap: 0; }

    .identity-card {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1.25rem 1.5rem;
      border: 1px solid rgba(255,255,255,0.06);
      border-radius: 6px;
      background: rgba(255,255,255,0.02);
      transition: all 0.3s ease;
      cursor: default;
    }
    .identity-card:hover {
      border-color: rgba(212,0,26,0.3);
      background: rgba(212,0,26,0.04);
    }
    .identity-card.engineer { margin-bottom: 0; }
    .identity-card.writer   { margin-top: 0; }

    .identity-icon {
      width: 40px; height: 40px;
      display: flex; align-items: center; justify-content: center;
      background: rgba(212,0,26,0.08);
      border-radius: 4px;
      color: #D4001A;
      flex-shrink: 0;
    }
    .identity-label {
      font-weight: 500;
      font-size: 0.95rem;
      margin-bottom: 0.2rem;
    }
    .identity-desc {
      font-size: 0.78rem;
      color: rgba(255,255,255,0.4);
      font-family: 'DM Mono', monospace;
      letter-spacing: 0.05em;
    }

    .identity-slash {
      text-align: center;
      font-family: 'Bebas Neue', sans-serif;
      font-size: 2rem;
      color: #D4001A;
      line-height: 1;
      padding: 0.5rem 0;
    }

    .about-stats {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      margin-top: 2rem;
      padding: 1.25rem 1.5rem;
      border-top: 1px solid rgba(255,255,255,0.06);
    }
    .stat { flex: 1; }
    .stat-value {
      font-family: 'Bebas Neue', sans-serif;
      font-size: 2.5rem;
      color: #D4001A;
      line-height: 1;
    }
    .stat-label {
      font-size: 0.7rem;
      color: rgba(255,255,255,0.35);
      font-family: 'DM Mono', monospace;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      margin-top: 0.25rem;
    }
    .stat-divider {
      width: 1px;
      height: 40px;
      background: rgba(255,255,255,0.08);
    }

    /* ─── NARRATIVE ─── */
    .about-narrative { padding-top: 3.5rem; }

    .narrative-text {
      font-size: 1.1rem;
      line-height: 1.9;
      color: rgba(255,255,255,0.7);
      font-weight: 300;
      margin-bottom: 2.5rem;
    }
    .narrative-text :global(strong) {
      color: #fff;
      font-weight: 500;
    }

    .about-quote {
      display: flex;
      gap: 1.25rem;
      align-items: flex-start;
    }
    .quote-bar {
      width: 3px;
      height: 100%;
      min-height: 60px;
      background: linear-gradient(to bottom, #D4001A, transparent);
      border-radius: 2px;
      flex-shrink: 0;
    }
    blockquote {
      font-family: 'Bebas Neue', sans-serif;
      font-size: 1.5rem;
      letter-spacing: 0.04em;
      line-height: 1.3;
      color: rgba(255,255,255,0.6);
    }

    @media (max-width: 900px) {
      .about-grid { grid-template-columns: 1fr; gap: 3rem; }
      .about-narrative { padding-top: 0; }
    }
  `]
})
export class AboutComponent {
  @Input() aboutText = `I exist at the intersection of logic and imagination. By day, I architect systems that solve real problems with clean, scalable code. By night, I craft narratives that explore what it means to be human.\n\nThis duality isn't a contradiction — it's the source of everything I create. The discipline of engineering sharpens my storytelling. The empathy of narrative writing deepens my engineering.\n\nEvery system I build tells a story. Every story I write follows a system.`;

  get formattedText(): string {
    return this.aboutText
      .split('\n\n')
      .map(p => `<p style="margin-bottom:1.2rem">${p}</p>`)
      .join('');
  }
}
