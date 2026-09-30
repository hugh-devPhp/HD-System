import { Component, Injector, OnInit, afterNextRender, inject } from '@angular/core';
import { ViewportScroller } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { forkJoin, catchError, of } from 'rxjs';
import { HeroComponent } from '../../components/hero/hero.component';
import { AboutComponent } from '../../components/about/about.component';
import { ProjectsComponent } from '../../components/projects/projects.component';
import { StoriesComponent } from '../../components/stories/stories.component';
import { ContactComponent } from '../../components/contact/contact.component';
import { PortfolioApiService, Project, Writing, HomepageContent } from '../../services/portfolio-api.service';
import { SeoService, DEFAULT_SEO } from '../../services/seo.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeroComponent, AboutComponent, ProjectsComponent, StoriesComponent, ContactComponent],
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit {
  private api = inject(PortfolioApiService);
  private seo = inject(SeoService);
  private route = inject(ActivatedRoute);
  private scroller = inject(ViewportScroller);
  private injector = inject(Injector);

  projects: Project[] = [];
  writings: Writing[] = [];
  content: HomepageContent = {};

  ngOnInit() {
    this.seo.update(DEFAULT_SEO);

    forkJoin({
      projects: this.api.getProjects().pipe(catchError(() => of([]))),
      writings: this.api.getWritings('published').pipe(catchError(() => of([]))),
      content:  this.api.getHomepageContent().pipe(catchError(() => of({}))),
    }).subscribe(({ projects, writings, content }) => {
      this.projects = projects;
      this.writings = writings;
      this.content  = content;

      // Sections grow once data is in: re-scroll to the requested anchor (e.g. /#contact)
      const fragment = this.route.snapshot.fragment;
      if (fragment) {
        afterNextRender(() => this.scroller.scrollToAnchor(fragment), { injector: this.injector });
      }
    });
  }
}
