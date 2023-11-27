import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, filter } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ThemeService {

  availableClasses: string[] = [];
  currentClassIdx: number = 0;

  bodyClass: string;

  private _actualTheme = new BehaviorSubject<any>(null);
  _ActualTheme = this._actualTheme.asObservable();

  constructor(@Inject(DOCUMENT) private document: Document, public _router: Router) {
    this.bodyClass = this.availableClasses[this.currentClassIdx];

    _router.events.pipe(
        filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
        if (event.url == '/login') {
            let metaTheme =  this.document.getElementById('meta-color') as HTMLMetaElement;
            metaTheme.content = '#ff9ea9';
        }
    });
  }

  setTheme(theme:any){
    this.availableClasses.push(theme);
    const bodyElement = document.body;

    if (bodyElement) {
      this.currentClassIdx = this.getNextClassIdx();
      const nextClass = this.availableClasses[this.currentClassIdx];
      const activeClass = this.availableClasses[this.getPrevClassIdx()];
      
      bodyElement.classList.remove(activeClass);
      bodyElement.classList.add(nextClass);
      
      let themeLink =  this.document.getElementById('app-theme') as HTMLLinkElement;
      themeLink.href = this.getPrimeNgTheme(theme);

       let metaTheme =  this.document.getElementById('meta-color') as HTMLMetaElement;
      metaTheme.content = this.getMetaColor(theme);

      this.bodyClass = nextClass;
      localStorage.setItem( 'theme' ,this.bodyClass);
      this.ActualTheme(this.bodyClass);
    }

  }
  
  getPrimeNgTheme(theme: string){
    switch (theme) {
      case 'theme-default-light': return 'lara-light-blue.css';
      case 'theme-default-dark': return 'lara-dark-blue.css';
      default: return 'lara-light-blue.css'
    }
  }

  getMetaColor(theme: string){
    switch (theme) {
      case 'theme-default-light': 
      case 'theme-ctsadmin': return '#236877';
      case 'theme-default-dark': return '#060811';
      default: return '#236877'
    }
  }

  getThemeSelected() {
    return localStorage.getItem('theme')!;
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
