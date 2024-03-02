import { Component, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Product } from '@methods/constants';
import { GetMethods, getCountryCode, getFlag, getSeverity, responseError } from '@methods/methods';
import { ResponseData } from '@models/models';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from '@services/api.service';
import { MediaResponse, MediaService } from '@services/media.service';
import { NotificationService } from '@services/notification.service';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-market-item',
  templateUrl: './market-item.component.html',
  styleUrls: ['./market-item.component.scss']
})
export class MarketItemComponent { 
    @Input() displayBasic: boolean = false;
    @Input() productId: any;

    private mediaSubscription: Subscription;
    Media: MediaResponse;

    payloadData: Product;
    textMessageLink: any;
    dayPublished: string;
    dayUpdated: string;
    responsiveOptions: any[] = [
        {
            breakpoint: '1024px',
            numVisible: 5
        },
        {
            breakpoint: '768px',
            numVisible: 3
        },
        {
            breakpoint: '560px',
            numVisible: 1
        }
    ];

    constructor(
        private _translateService: TranslateService, 
        private _apiService: ApiService, 
        private _notificationService: NotificationService, 
        public _satin: DomSanitizer,
        private _media: MediaService,  
        private route: ActivatedRoute){
         //Para registro con codigo qr    
         this.route.params.subscribe(params => { 
            if(params){
                this.productId = params.id;
            }
        });
        this.mediaSubscription = this._media.subscribeMedia().subscribe(media => {
            this.Media = media;
        });
    }

    ngOnInit(): void {
        //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
        //Add 'implements OnInit' to the class.
        this.getProductById(this.productId)
    }

    getProductById(productId: string){
        const URL = `${environment.WebApiUrl + GetMethods.ADMIN_GET_CATALOG_BY_ID + productId }`;
        this._apiService.apiGetMethod(URL).subscribe({
            next: (result: ResponseData) => {
                moment.locale('es')
                this.payloadData = result.payload;
                this.dayPublished = moment(this.payloadData.createdAt).fromNow(); 
                this.dayUpdated = moment(this.payloadData.updatedAt).fromNow();  

                const urlbyPass = `https//${ window.location.hostname}/marketplace/item/${productId}`

                const textMessageLink = `
                Hola\n

                Me interesa este articulo, esta disponible? \n

                Link: ${urlbyPass}
                `

                this.textMessageLink = `https://wa.me/${this.getFlag(this.payloadData.country)}${this.removeRegex(this.payloadData.phone)}?text=${textMessageLink}`
            },
            error: (err: any) => {
                console.log(err);
                const messageTypeErrorText = responseError(err.status);
                this._notificationService.error(messageTypeErrorText, 'bg-dark', 'animate__backInUp', 6000);
            }
        });
    }

    removeRegex(phoneNumber){
        if(phoneNumber)
        return phoneNumber.replace(/-/g, '');
    }

    byPassSecurity(textHtml: any){
        return this._satin.bypassSecurityTrustHtml(textHtml)
    }

    byPassSecurityURL(url: any){
        return this._satin.bypassSecurityTrustUrl(url)
    }

    getFlag(country: string){
        return getCountryCode(country);
    }

    getSeverity(statusProduct: any){
        return getSeverity(statusProduct)
    }

    TranslateText(text: string) {
        return this._translateService.instant(text);
    } 
}
