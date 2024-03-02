import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from './api.service';
@Injectable({
    providedIn: 'root'
})

export class ThemeService {

    availableClasses: string[] = [];
    currentClassIdx: number = 0;

    bodyClass: string;
    isBrowser: boolean;

    private _actualTheme = new BehaviorSubject<any>(null);
    _ActualTheme = this._actualTheme.asObservable();

    constructor(@Inject(DOCUMENT) private document: Document, private _apiService: ApiService, private _meta: Meta, @Inject(PLATFORM_ID) private platformId: Object,) {
        this.bodyClass = this.availableClasses[this.currentClassIdx];
    }

    setTheme(theme: any) {
        this.availableClasses.push(theme);
        if(isPlatformBrowser(this.platformId)){
            const bodyElement = document.body;

            if (bodyElement) {
                this.currentClassIdx = this.getNextClassIdx();
                const nextClass = this.availableClasses[this.currentClassIdx];
                const activeClass = this.availableClasses[this.getPrevClassIdx()];
    
                bodyElement.classList.remove(activeClass);
                bodyElement.classList.add(nextClass);
    
                let themeLink = this.document.getElementById('app-theme') as HTMLLinkElement;
                themeLink.href = this.getPrimeNgTheme(theme);
    
                const currentRoute = this._apiService.getRouterLink();
    
                let metaTheme = this.document.getElementById('meta-color') as HTMLMetaElement;
                metaTheme.content = currentRoute == '/login' ? '#29859ef0' : this.getMetaColor(theme);
    
                this.bodyClass = nextClass;
                localStorage.setItem('theme', this.bodyClass);
                this.ActualTheme(this.bodyClass);
            }
        }

    }

    getPrimeNgTheme(theme: string) {
        switch (theme) {
            case 'theme-default-light': return 'lara-light-blue.css';
            case 'theme-default-dark': return 'lara-dark-blue.css';
            case 'theme-atlantis-dark': return 'indigo-dark.css';
            default: return 'lara-light-blue.css'
        }
    }

    getMetaColor(theme: string) {
        switch (theme) {
            case 'theme-default-light':
            case 'theme-ctsadmin': return '#236877';
            case 'theme-default-dark': return '#060811';
            case 'theme-atlantis-dark': return '#2E323F';
            default: return '#236877'
        }
    }

    getThemeSelected() {
        return isPlatformBrowser(this.platformId) ? localStorage.getItem('theme')! : 'theme-default-light';
    }

    getPrevClassIdx(): number {
        return this.currentClassIdx === 0 ? this.availableClasses.length - 1 : this.currentClassIdx - 1;
    }

    getNextClassIdx(): number {
        return this.currentClassIdx === this.availableClasses.length - 1 ? 0 : this.currentClassIdx + 1;
    }

    ActualTheme(pTheme: any) {
        this._actualTheme.next(pTheme)
    }
}
