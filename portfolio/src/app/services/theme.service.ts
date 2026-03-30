import { Injectable, signal, effect } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
    theme = signal<'dark' | 'light'>(this.getSaved());

    constructor() {
        effect(() => {
            const t = this.theme();
            document.documentElement.setAttribute('data-theme', t);
            localStorage.setItem('hd-theme', t);
        });
    }

    toggle() {
        this.theme.update(t => t === 'dark' ? 'light' : 'dark');
    }

    private getSaved(): 'dark' | 'light' {
        return (localStorage.getItem('hd-theme') as 'dark' | 'light') ?? 'dark';
    }
}