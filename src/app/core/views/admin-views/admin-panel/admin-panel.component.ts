import { Component, OnInit } from '@angular/core';
import { CountryFlag, getCountry } from '@methods/countrycode';
import { responseError } from '@methods/methods';
import { ApiService } from '@services/api.service';
import { NotificationService } from '@services/notification.service';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html'
})
export class AdminPanelComponent implements OnInit {
    country: any;
    constructor(private _apiService: ApiService, private _notificationService: NotificationService){}
    ngOnInit(): void {
        this.country = getCountry();
        this.getFlags()
    }

    getFlags(){
        const country_code = CountryFlag.find(element => this.country == element.name); 
        console.log(country_code)
    }
}
