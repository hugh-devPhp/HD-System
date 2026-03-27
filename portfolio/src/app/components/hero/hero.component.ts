import { Component, Input, OnInit, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="hero" class="hero">
      <!-- Scanline effect -->
      <div class="scanline"></div>

      <!-- Background grid -->
      <div class="hero-grid"></div>

      <!-- Red glow orb -->
      <div class="glow-orb"></div>

      <div class="hero-content container">
        <!-- Logo mark -->
        <div class="hero-logo animate-in" style="animation-delay: 0.1s">
          <div class="logo-frame">
            <img src="assets/hd-logo.png" alt="HD Logo" class="logo-img" />
          </div>
        </div>

        <!-- Name -->
        <div class="hero-name animate-in" style="animation-delay: 0.3s">
          <span class="name-label">Hugues-Devallois</span>
        </div>

        <!-- Tagline -->
        <h1 class="hero-tagline animate-in" style="animation-delay: 0.5s">
          {{ tagline }}
        </h1>

        <!-- Intro -->
        <p class="hero-intro animate-in" style="animation-delay: 0.7s">
          {{ intro }}
        </p>

        <!-- CTAs -->
        <div class="hero-cta animate-in" style="animation-delay: 0.9s">
          <a href="#projects" class="btn btn-primary">
            <span>View Projects</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </a>
          <a href="#contact" class="btn btn-outline">Contact</a>
        </div>

        <!-- Scroll indicator -->
        <div class="scroll-indicator animate-in" style="animation-delay: 1.2s">
          <div class="scroll-line"></div>
          <span>SCROLL</span>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .hero {
      position: relative;
      min-height: 100vh;
      display: flex;
      align-items: center;
      overflow: hidden;
      background: #080808;
    }

    /* Grid background */
    .hero-grid {
      position: absolute;
      inset: 0;
      background-image:
        linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
      background-size: 80px 80px;
      mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%);
    }

    /* Red glow */
    .glow-orb {
      position: absolute;
      top: 20%;
      left: 50%;
      transform: translateX(-50%);
      width: 600px;
      height: 600px;
      background: radial-gradient(ellipse, rgba(212,0,26,0.12) 0%, transparent 70%);
      pointer-events: none;
    }

    /* Scanline */
    .scanline {
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 2px;
      background: linear-gradient(90deg, transparent, rgba(212,0,26,0.6), transparent);
      animation: scanline 6s linear infinite;
      z-index: 1;
    }

    @keyframes scanline {
      0%   { top: 0; opacity: 1; }
      95%  { opacity: 0.5; }
      100% { top: 100%; opacity: 0; }
    }

    /* Content */
    .hero-content {
      position: relative;
      z-index: 2;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding-top: 8rem;
      padding-bottom: 6rem;
      gap: 0;
    }

    /* Logo */
    .hero-logo { margin-bottom: 1.5rem; }
    .logo-frame {
      width: 120px;
      height: 120px;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
    }
    .logo-frame::before {
      content: '';
      position: absolute;
      inset: -12px;
      border: 1px solid rgba(212,0,26,0.2);
      border-radius: 4px;
      animation: pulse-border 3s ease infinite;
    }
    @keyframes pulse-border {
      0%, 100% { opacity: 0.3; transform: scale(1); }
      50%       { opacity: 0.8; transform: scale(1.04); }
    }
    .logo-img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      filter: drop-shadow(0 0 20px rgba(212,0,26,0.5));
    }

    /* Name */
    .hero-name { margin-bottom: 1rem; }
    .name-label {
      font-family: 'DM Mono', monospace;
      font-size: 0.75rem;
      letter-spacing: 0.3em;
      text-transform: uppercase;
      color: rgba(255,255,255,0.4);
    }

    /* Tagline */
    .hero-tagline {
      font-family: 'Bebas Neue', sans-serif;
      font-size: clamp(2.5rem, 6vw, 5rem);
      letter-spacing: 0.04em;
      line-height: 1.05;
      color: #fff;
      margin-bottom: 1.5rem;
    }

    /* Intro */
    .hero-intro {
      font-size: 1.05rem;
      color: rgba(255,255,255,0.55);
      max-width: 520px;
      line-height: 1.7;
      margin-bottom: 2.5rem;
      font-weight: 300;
    }

    /* CTA */
    .hero-cta {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
      justify-content: center;
      margin-bottom: 4rem;
    }

    /* Scroll */
    .scroll-indicator {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      color: rgba(255,255,255,0.25);
      font-family: 'DM Mono', monospace;
      font-size: 0.65rem;
      letter-spacing: 0.2em;
    }
    .scroll-line {
      width: 1px;
      height: 48px;
      background: linear-gradient(to bottom, rgba(212,0,26,0.8), transparent);
      animation: scroll-pulse 2s ease infinite;
    }
    @keyframes scroll-pulse {
      0%, 100% { opacity: 0.3; }
      50%       { opacity: 1; }
    }

    /* Animate in */
    .animate-in {
      opacity: 0;
      animation: fadeUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    }
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(20px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    @media (max-width: 768px) {
      .hero-tagline { font-size: 2.2rem; }
    }
  `]
})
export class HeroComponent {
  @Input() tagline = 'Engineer of Systems. Writer of Stories.';
  @Input() intro = 'I build software that works and write stories that matter. Two crafts. One vision.';
}
