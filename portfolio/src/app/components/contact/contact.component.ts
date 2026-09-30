import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./contact.component.html",
  styleUrls: ["./contact.component.scss"]
})
export class ContactComponent {
  @Input() message = "Let's build something — or tell a story together.";
  @Input() email = 'contact@hugues-devallois.com';
  @Input() whatsapp = '+33600000000';

  get year() { return new Date().getFullYear(); }
  get whatsappLink() { return `https://wa.me/${this.whatsapp.replace(/\D/g, '')}`; }
}
