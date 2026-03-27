import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HeroComponent } from './components/hero/hero.component';
import { AboutComponent } from './components/about/about.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { StoriesComponent } from './components/stories/stories.component';
import { ContactComponent } from './components/contact/contact.component';
import { PortfolioApiService, Project, Writing, HomepageContent } from './services/portfolio-api.service';
import { forkJoin, catchError, of } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    NavbarComponent,
    HeroComponent,
    AboutComponent,
    ProjectsComponent,
    StoriesComponent,
    ContactComponent,
  ],
  template: `
    <app-navbar></app-navbar>

    <main>
      <app-hero
        [tagline]="content['tagline'] || 'Engineer of Systems. Writer of Stories.'"
        [intro]="content['hero_intro'] || 'I build software that works and write stories that matter. Two crafts. One vision.'"
      ></app-hero>

      <div class="divider"></div>

      <app-about
        [aboutText]="content['about_text'] || ''"
      ></app-about>

      <div class="divider"></div>

      <app-projects [projects]="projects"></app-projects>

      <div class="divider"></div>

      <app-stories [writings]="writings"></app-stories>

      <app-contact
        [message]="content['contact_message'] || ''"
        [email]="content['email'] || ''"
        [whatsapp]="content['whatsapp'] || ''"
      ></app-contact>
    </main>
  `,
  styles: [`
    .divider {
      width: 100%;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent);
    }
  `]
})
export class AppComponent implements OnInit {
  private api = inject(PortfolioApiService);

  projects: Project[] = [];
  writings: Writing[] = [];
  content: HomepageContent = {};

  ngOnInit() {
    forkJoin({
      projects: this.api.getProjects().pipe(catchError(() => of([]))),
      writings: this.api.getWritings('published').pipe(catchError(() => of([]))),
      content:  this.api.getHomepageContent().pipe(catchError(() => of({}))),
    }).subscribe(({ projects, writings, content }) => {
      this.projects = projects;
      this.writings = writings;
      this.content  = content;
    });
  }
}
