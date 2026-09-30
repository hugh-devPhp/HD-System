import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { TopbarComponent } from '../../components/topbar/topbar.component';
import { AdminApiService } from '../../services/admin-api.service';
import { ToastService } from '../../services/toast.service';

interface ContentField {
  key: string;
  label: string;
  hint: string;
  multiline?: boolean;
  value: string;
}

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent, TopbarComponent],
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {
  private api    = inject(AdminApiService);
  private toasts = inject(ToastService);

  loading = signal(true);
  saving  = signal(false);
  fields  = signal<ContentField[]>([]);

  fieldDefs: Omit<ContentField, 'value'>[] = [
    { key: 'hero_title',    label: 'Hero Title',    hint: 'Usually "HD"', multiline: false },
    { key: 'hero_subtitle', label: 'Hero Subtitle', hint: 'Your name', multiline: false },
    { key: 'tagline',       label: 'Tagline',       hint: 'Main catchphrase', multiline: false },
    { key: 'hero_intro',    label: 'Hero Intro',    hint: 'Short cinematic sentence', multiline: true },
    { key: 'about_text',    label: 'About Text',    hint: 'Narrative bio. Use \\n\\n for paragraphs.', multiline: true },
    { key: 'contact_message', label: 'Contact Message', hint: 'Closing CTA message', multiline: true },
    { key: 'email',    label: 'Email',    hint: 'Public email address', multiline: false },
    { key: 'whatsapp', label: 'WhatsApp', hint: 'With country code, e.g. +33600000000', multiline: false },
  ];

  heroFields    = () => this.fields().filter(f => ['hero_title','hero_subtitle','tagline','hero_intro'].includes(f.key));
  aboutFields   = () => this.fields().filter(f => ['about_text'].includes(f.key));
  contactFields = () => this.fields().filter(f => ['contact_message','email','whatsapp'].includes(f.key));

  ngOnInit() {
    this.api.getHomepage().subscribe({
      next: items => {
        const map = new Map(items.map(i => [i.key, i.value]));
        this.fields.set(this.fieldDefs.map(def => ({
          ...def,
          value: map.get(def.key) ?? ''
        })));
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  getVal(key: string): string {
    return this.fields().find(f => f.key === key)?.value ?? '';
  }

  save() {
    this.saving.set(true);
    const items = this.fields().map(f => ({ key: f.key, value: f.value }));
    this.api.updateHomepage(items).subscribe({
      next: () => { this.toasts.show('Homepage content saved.', 'success'); this.saving.set(false); },
      error: () => { this.toasts.show('Save failed.', 'error'); this.saving.set(false); }
    });
  }
}
