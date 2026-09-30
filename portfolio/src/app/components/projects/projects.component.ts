import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Project } from '../../services/portfolio-api.service';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./projects.component.html",
  styleUrls: ["./projects.component.scss"]
})
export class ProjectsComponent {
  @Input() projects: Project[] = [];
}
