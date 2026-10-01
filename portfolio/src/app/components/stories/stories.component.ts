import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Writing } from '../../services/portfolio-api.service';

@Component({
  selector: 'app-stories',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: "./stories.component.html",
  styleUrls: ["./stories.component.scss"]
})
export class StoriesComponent {
  @Input() set writings(val: Writing[]) {
    this._writings = val;
  }
  get writings() { return this._writings; }
  private _writings: Writing[] = [];

  activeFilter = signal<string>('all');

  types = [
    { value: 'film_idea', label: 'Film Ideas' },
    { value: 'script',    label: 'Scripts' },
    { value: 'synopsis',  label: 'Synopses' },
    { value: 'article',   label: 'Articles' },
  ];

  frames = Array.from({ length: 20 }, (_, i) => String(i + 1).padStart(4, '0'));

  get filteredWritings(): Writing[] {
    const f = this.activeFilter();
    return f === 'all' ? this._writings : this._writings.filter(w => w.type === f);
  }

  setFilter(type: string) { this.activeFilter.set(type); }

  getTypeLabel(type: string): string {
    return this.types.find(t => t.value === type)?.label.replace(/s$/, '') ?? type;
  }
}
