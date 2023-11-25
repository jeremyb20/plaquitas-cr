import { Component, OnInit } from '@angular/core';
import { getCountry } from '@methods/countrycode';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html'
})
export class AdminPanelComponent implements OnInit {
  country: any;

  ngOnInit(): void {
    this.country = getCountry();
  }
}
