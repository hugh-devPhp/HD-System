import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="contact" class="contact-section">
      <div class="container">
        <div class="contact-inner">
          <!-- Decorative label -->
          <div class="section-label">Contact</div>

          <!-- Big heading -->
          <h2 class="contact-title">
            Let's build<br/>
            <span class="title-accent">something.</span>
          </h2>

          <p class="contact-message">{{ message }}</p>

          <!-- Actions -->
          <div class="contact-actions">
            <a [href]="'mailto:' + email" class="contact-btn email-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              <span>Send an Email</span>
              <span class="btn-email-addr">{{ email }}</span>
            </a>

            <a [href]="whatsappLink" target="_blank" class="contact-btn whatsapp-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="site-footer">
        <div class="container">
          <div class="footer-inner">
            <span class="footer-brand">HD — Hugues-Devallois</span>
            <span class="footer-copy">© {{ year }} · Built with precision.</span>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .contact-section {
      background: #080808;
      position: relative;
      overflow: hidden;
    }
    .contact-section::before {
      content: '';
      position: absolute;
      bottom: 0; left: 50%;
      transform: translateX(-50%);
      width: 800px; height: 400px;
      background: radial-gradient(ellipse, rgba(212,0,26,0.08) 0%, transparent 70%);
      pointer-events: none;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 2rem;
    }

    .contact-inner {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      padding: 8rem 0 6rem;
      max-width: 700px;
    }

    .contact-title {
      font-family: 'Bebas Neue', sans-serif;
      font-size: clamp(3.5rem, 8vw, 7rem);
      line-height: 1;
      letter-spacing: 0.02em;
      color: rgba(255,255,255,0.9);
      margin-bottom: 1.5rem;
    }
    .title-accent { color: #D4001A; }

    .contact-message {
      font-size: 1.05rem;
      color: rgba(255,255,255,0.45);
      font-weight: 300;
      line-height: 1.7;
      margin-bottom: 3rem;
      max-width: 440px;
    }

    .contact-actions {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .contact-btn {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1rem 1.75rem;
      border-radius: 4px;
      font-size: 0.9rem;
      font-weight: 500;
      transition: all 0.3s ease;
      cursor: pointer;
      border: 1px solid transparent;
    }

    .email-btn {
      background: #D4001A;
      color: #fff;
      flex-direction: column;
      align-items: flex-start;
      gap: 0.2rem;
      padding: 1.25rem 1.75rem;
    }
    .email-btn:hover {
      background: #ff001f;
      box-shadow: 0 8px 32px rgba(212,0,26,0.4);
      transform: translateY(-2px);
    }
    .btn-email-addr {
      font-family: 'DM Mono', monospace;
      font-size: 0.7rem;
      color: rgba(255,255,255,0.6);
      letter-spacing: 0.05em;
    }

    .whatsapp-btn {
      background: transparent;
      color: rgba(255,255,255,0.7);
      border-color: rgba(255,255,255,0.12);
    }
    .whatsapp-btn:hover {
      background: rgba(255,255,255,0.04);
      border-color: rgba(255,255,255,0.25);
      color: #fff;
      transform: translateY(-2px);
    }

    /* Footer */
    .site-footer {
      border-top: 1px solid rgba(255,255,255,0.06);
      padding: 2rem 0;
    }
    .footer-inner {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .footer-brand {
      font-family: 'DM Mono', monospace;
      font-size: 0.75rem;
      color: rgba(255,255,255,0.3);
      letter-spacing: 0.1em;
    }
    .footer-copy {
      font-family: 'DM Mono', monospace;
      font-size: 0.7rem;
      color: rgba(255,255,255,0.2);
    }

    @media (max-width: 768px) {
      .footer-inner { flex-direction: column; gap: 0.5rem; text-align: center; }
      .email-btn { flex-direction: row; align-items: center; }
      .btn-email-addr { display: none; }
    }
  `]
})
export class ContactComponent {
  @Input() message = "Let's build something — or tell a story together.";
  @Input() email = 'contact@hugues-devallois.com';
  @Input() whatsapp = '+33600000000';

  get year() { return new Date().getFullYear(); }
  get whatsappLink() { return `https://wa.me/${this.whatsapp.replace(/\D/g, '')}`; }
}
