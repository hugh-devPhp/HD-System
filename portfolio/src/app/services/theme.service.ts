import { Injectable, signal, effect, inject, PLATFORM_ID } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class ThemeService {
    private document = inject(DOCUMENT);
    private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

    theme = signal<'dark' | 'light'>(this.getSaved());

    constructor() {
        effect(() => {
            const t = this.theme();
            this.document.documentElement.setAttribute('data-theme', t);
            if (this.isBrowser) {
                try { localStorage.setItem('hd-theme', t); } catch { /* storage unavailable */ }
            }
        });
    }

    toggle() {
        this.theme.update(t => t === 'dark' ? 'light' : 'dark');
    }

    private getSaved(): 'dark' | 'light' {
        if (!this.isBrowser) return 'dark';
        try {
            return (localStorage.getItem('hd-theme') as 'dark' | 'light') ?? 'dark';
        } catch {
            return 'dark';
        }
    }
}
