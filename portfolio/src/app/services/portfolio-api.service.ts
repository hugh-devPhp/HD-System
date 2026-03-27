import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Project {
  id: number;
  title: string;
  description: string;
  tech_stack: string[];
  github_link?: string;
  live_demo_link?: string;
  featured: boolean;
  images: string[];
  order: number;
  created_at: string;
}

export interface Writing {
  id: number;
  title: string;
  type: 'film_idea' | 'script' | 'synopsis' | 'article';
  content: string;
  excerpt?: string;
  status: 'draft' | 'published';
  featured: boolean;
  cover_image?: string;
  order: number;
  created_at: string;
}

export interface HomepageContent {
  [key: string]: string;
}

@Injectable({ providedIn: 'root' })
export class PortfolioApiService {
  private http = inject(HttpClient);
  private api = environment.apiUrl;

  getProjects(featured?: boolean): Observable<Project[]> {
    const params = featured !== undefined ? `?featured=${featured}` : '';
    return this.http.get<Project[]>(`${this.api}/projects${params}`);
  }

  getWritings(status = 'published'): Observable<Writing[]> {
    return this.http.get<Writing[]>(`${this.api}/writing?status=${status}`);
  }

  getHomepageContent(): Observable<HomepageContent> {
    return this.http.get<{ key: string; value: string }[]>(`${this.api}/homepage`).pipe(
      map(items => items.reduce((acc, item) => ({ ...acc, [item.key]: item.value }), {} as HomepageContent))
    );
  }
}
