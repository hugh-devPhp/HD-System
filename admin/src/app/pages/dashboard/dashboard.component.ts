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
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
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
