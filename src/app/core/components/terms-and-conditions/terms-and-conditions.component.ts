import { Component } from '@angular/core';

@Component({
  selector: 'app-terms-and-conditions',
  templateUrl: './terms-and-conditions.component.html'
})
export class TermsAndConditionsComponent {
  websiteName: string = ''

  ngOnInit(): void {
    this.websiteName = 'Plaquitas para mascotas CR'
  }
}
