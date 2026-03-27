import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

export interface Project {
  id?: number;
  title: string;
  description: string;
  tech_stack: string[];
  github_link?: string;
  live_demo_link?: string;
  featured: boolean;
  images: string[];
  order: number;
  created_at?: string;
}

export interface Writing {
  id?: number;
  title: string;
  type: string;
  content: string;
  excerpt?: string;
  status: string;
  featured: boolean;
  cover_image?: string;
  order: number;
  created_at?: string;
}

export interface HomepageItem {
  id?: number;
  key: string;
  value: string;
}

@Injectable({ providedIn: 'root' })
export class AdminApiService {
  private http = inject(HttpClient);
  private api  = environment.apiUrl;

  // Projects
  getProjects()                  { return this.http.get<Project[]>(`${this.api}/projects`); }
  createProject(p: Project)      { return this.http.post<Project>(`${this.api}/projects`, p); }
  updateProject(id: number, p: Partial<Project>) { return this.http.put<Project>(`${this.api}/projects/${id}`, p); }
  deleteProject(id: number)      { return this.http.delete(`${this.api}/projects/${id}`); }

  // Writing
  getWritings()                  { return this.http.get<Writing[]>(`${this.api}/writing`); }
  createWriting(w: Writing)      { return this.http.post<Writing>(`${this.api}/writing`, w); }
  updateWriting(id: number, w: Partial<Writing>) { return this.http.put<Writing>(`${this.api}/writing/${id}`, w); }
  deleteWriting(id: number)      { return this.http.delete(`${this.api}/writing/${id}`); }

  // Homepage
  getHomepage()                  { return this.http.get<HomepageItem[]>(`${this.api}/homepage`); }
  updateHomepage(items: HomepageItem[]) {
    return this.http.put<HomepageItem[]>(`${this.api}/homepage`, { items });
  }

  // Media
  uploadMedia(file: File) {
    const fd = new FormData();
    fd.append('file', file);
    return this.http.post<{ url: string; filename: string; size: number }>(`${this.api}/media/upload`, fd);
  }
  listMedia() { return this.http.get<{ filename: string; url: string; size: number }[]>(`${this.api}/media/list`); }
}
