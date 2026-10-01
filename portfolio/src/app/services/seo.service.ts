import { Injectable, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';
import { environment } from '../../environments/environment';

export interface SeoData {
  title: string;
  description: string;
  /** Path relative to the site root, e.g. `/stories/3` */
  path: string;
  type?: 'website' | 'article';
  /** Absolute URL or path served by the API (e.g. `/uploads/x.jpg`) */
  image?: string | null;
  publishedTime?: string;
  noindex?: boolean;
}

export const DEFAULT_SEO: SeoData = {
  title: 'HD — Hugues-Devallois',
  description: 'Hugues-Devallois — Software Engineer & Screenwriter. Building systems and writing stories.',
  path: '/',
  type: 'website',
};

@Injectable({ providedIn: 'root' })
export class SeoService {
  private title = inject(Title);
  private meta = inject(Meta);
  private document = inject(DOCUMENT);

  update(data: SeoData) {
    const url = `${environment.siteUrl}${data.path}`;
    const image = this.absoluteImage(data.image);

    this.title.setTitle(data.title);
    this.setName('description', data.description);
    this.setName('robots', data.noindex ? 'noindex, nofollow' : 'index, follow');

    this.setProperty('og:title', data.title);
    this.setProperty('og:description', data.description);
    this.setProperty('og:type', data.type ?? 'website');
    this.setProperty('og:url', url);
    this.setProperty('og:site_name', 'HD — Hugues-Devallois');
    this.setName('twitter:card', image ? 'summary_large_image' : 'summary');

    if (image) this.setProperty('og:image', image);
    else this.meta.removeTag("property='og:image'");

    if (data.publishedTime) this.setProperty('article:published_time', data.publishedTime);
    else this.meta.removeTag("property='article:published_time'");

    this.setCanonical(url);
  }

  private setName(name: string, content: string) {
    this.meta.updateTag({ name, content });
  }

  private setProperty(property: string, content: string) {
    this.meta.updateTag({ property, content });
  }

  private setCanonical(url: string) {
    let link = this.document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.document.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }

  private absoluteImage(image?: string | null): string | null {
    if (!image) return null;
    return image.startsWith('/') ? `${environment.apiUrl}${image}` : image;
  }
}
