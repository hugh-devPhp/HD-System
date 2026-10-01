import { Component, Input, OnInit, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./hero.component.html",
  styleUrls: ["./hero.component.scss"]
})
export class HeroComponent {
  @Input() tagline = 'Engineer of Systems. Writer of Stories.';
  @Input() intro = 'I build software that works and write stories that matter. Two crafts. One vision.';
}
