import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./about.component.html",
  styleUrls: ["./about.component.scss"]
})
export class AboutComponent {
  @Input() aboutText = `I exist at the intersection of logic and imagination. By day, I architect systems that solve real problems with clean, scalable code. By night, I craft narratives that explore what it means to be human.\n\nThis duality isn't a contradiction — it's the source of everything I create. The discipline of engineering sharpens my storytelling. The empathy of narrative writing deepens my engineering.\n\nEvery system I build tells a story. Every story I write follows a system.`;

  get formattedText(): string {
    return this.aboutText
      .split('\n\n')
      .map(p => `<p>${p}</p>`)
      .join('');
  }
}
