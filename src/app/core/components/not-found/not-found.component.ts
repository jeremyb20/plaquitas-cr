import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html'
})
export class NotFoundComponent {

  previousUrl: string = '';
  currentUrl: string = '';

  constructor(private _route: Router ,private _location: Location){
    _route.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.previousUrl = this.currentUrl;
        this.currentUrl = event.url;
      };
    });
  }

  backToHome() {
    if (window.history.length > 1) {
      this._location.back()
    } else {
      this._route.navigate([this.previousUrl])
    }
  }
}
