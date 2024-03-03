import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';

import { NotificationService } from '@services/notification.service';
import { MediaService, MediaResponse } from '@services/media.service';
import { Subscription } from 'rxjs';
import { ThemeService } from '@services/theme.service';
import { Product } from '@methods/constants';
import { environment } from 'src/environments/environment';
import { GetMethods, getSeverity, responseError } from '@methods/methods';
import { ApiService } from '@services/api.service';
import { ResponseData } from '@models/models';
import { TranslateService } from '@ngx-translate/core';

declare var bootstrap: any;

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    private mediaSubscription: Subscription;
    Media: MediaResponse;
    isNavbarTransparent = true;
    products!: Product[];
    responsiveOptions: any[] | undefined;
    year:any;

    constructor(
        private media: MediaService,
        private _notificationService: NotificationService,
        private _apiService: ApiService,
        private _themeService: ThemeService,
        private _translateService: TranslateService,
        private router: Router) {
        this.mediaSubscription = this.media.subscribeMedia().subscribe(result => {
            this.Media = result;
        });
        const moonLanding = new Date();
        this.year = moonLanding.getFullYear();
    }

    ngOnInit() {
        this._themeService.setTheme('theme-default-light');
        if(window.location.hash ) { 
            var someVarName = document.querySelector(window.location.hash); // theTabID of the tab you want to open
            var tab = new bootstrap.Tab(someVarName);
            tab.show();
        }
        this.responsiveOptions = [
            {
                breakpoint: '1400px',
                numVisible: 3,
                numScroll: 3
            },
            {
                breakpoint: '1220px',
                numVisible: 2,
                numScroll: 2
            },
            {
                breakpoint: '1100px',
                numVisible: 1,
                numScroll: 1
            }
        ];
        this.getAllInventory();
    }

    hashchanged(pTab:any){
        if(window.location.hash == pTab ) { 
            var someVarName = document.querySelector('#'+pTab); // theTabID of the tab you want to open
            var tab = new bootstrap.Tab(someVarName);
            tab.show();
        }
    }

    getAllInventory(){
        const URL = `${environment.WebApiUrl + GetMethods.GET_ALL_PROMO_LIST }`;
        this._apiService.apiGetMethod(URL).subscribe({
            next: (result: ResponseData) => {
                this.products = result.payload;
            },
            error: (err: any) => {
                console.log(err);
                const messageTypeErrorText = responseError(err.status);
                this._notificationService.error(messageTypeErrorText, 'bg-dark', 'animate__backInUp', 6000);
            }
        });
    }

    getSeverity(statusProduct: any){
        return getSeverity(statusProduct)
    }

    @HostListener('window:scroll', ['$event'])
    onWindowScroll() {
        // Verifica la posición del scroll
        if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
            this.isNavbarTransparent = false;

            //   if (document.body.scrollTop > 840 || document.documentElement.scrollTop > 840) {
            //     this.isNavbarTransparent = true;

            //   }
        } else {
            this.isNavbarTransparent = true;
        }
    }

    showMovileNav() {
        this.isNavbarTransparent = false;
    }

    TranslateText(text: string) {
        return this._translateService.instant(text);
    } 

}
