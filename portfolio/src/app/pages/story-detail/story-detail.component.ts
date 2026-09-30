import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { Marked } from 'marked';
import { PortfolioApiService, Writing } from '../../services/portfolio-api.service';
import { SeoService, DEFAULT_SEO } from '../../services/seo.service';
import { environment } from '../../../environments/environment';

const TYPE_LABELS: Record<Writing['type'], string> = {
  film_idea: 'Film Idea',
  script:    'Script',
  synopsis:  'Synopsis',
  article:   'Article',
};

// The page title is the only <h1>: Markdown headings are shifted one level down
const markdown = new Marked({
  gfm: true,
  breaks: true,
  async: false,
  walkTokens: token => {
    if (token.type === 'heading') token.depth = Math.min(token.depth + 1, 6);
  },
});

@Component({
  selector: 'app-story-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: "./story-detail.component.html",
  styleUrls: ["./story-detail.component.scss"]
})
export class StoryDetailComponent {
  private route = inject(ActivatedRoute);
  private api = inject(PortfolioApiService);
  private seo = inject(SeoService);

  story = signal<Writing | null>(null);
  notFound = signal(false);

  // Rendered HTML goes through [innerHTML], which Angular sanitizes (no scripts / event handlers)
  html = computed(() => {
    const s = this.story();
    if (!s) return '';
    // Drop a leading heading that just repeats the title (already shown in the header)
    const body = s.content.replace(/^\s*#{1,6}\s+(.+)\n/, (line, text: string) =>
      text.trim().toLowerCase() === s.title.trim().toLowerCase() ? '' : line);
    return markdown.parse(body) as string;
  });

  coverUrl = computed(() => {
    const cover = this.story()?.cover_image;
    if (!cover) return null;
    return cover.startsWith('/') ? `${environment.apiUrl}${cover}` : cover;
  });

  constructor() {
    this.route.paramMap.pipe(
      map(params => Number(params.get('id'))),
      tap(() => { this.story.set(null); this.notFound.set(false); }),
      switchMap(id => {
        const request = Number.isInteger(id) && id > 0
          ? this.api.getWriting(id).pipe(catchError(() => of(null)))
          : of(null);
        return request.pipe(map(story => ({ id, story })));
      }),
      takeUntilDestroyed(),
    ).subscribe(({ id, story }) => {
      // The API also returns drafts: only published entries are public
      if (story && story.status === 'published') {
        this.story.set(story);
        this.seo.update({
          title: `${story.title} — HD`,
          description: story.excerpt || this.plainText(story.content),
          path: `/stories/${story.id}`,
          type: 'article',
          image: story.cover_image,
          publishedTime: story.created_at,
        });
      } else {
        this.notFound.set(true);
        this.seo.update({
          title: 'Story not found — HD',
          description: DEFAULT_SEO.description,
          path: `/stories/${id}`,
          noindex: true,
        });
      }
    });
  }

  typeLabel(type: Writing['type']): string {
    return TYPE_LABELS[type] ?? type;
  }

  private plainText(markdown: string): string {
    const text = markdown.replace(/[#*_>`~\[\]()-]/g, '').replace(/\s+/g, ' ').trim();
    return text.length > 160 ? `${text.slice(0, 157)}...` : text;
  }
}
