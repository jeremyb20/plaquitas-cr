import { isPlatformBrowser, Location } from '@angular/common';
import { Component, Inject, Input, PLATFORM_ID } from '@angular/core';
import { DomSanitizer, Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Product } from '@methods/constants';
import { GetMethods, getCountryCode, getFlag, getSeverity, responseError } from '@methods/methods';
import { ResponseData } from '@models/models';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from '@services/api.service';
import { MediaResponse, MediaService } from '@services/media.service';
import { NotificationService } from '@services/notification.service';
import * as moment from 'moment';
import { ClipboardService } from 'ngx-clipboard';
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
    previousUrl: string = '';
    urlbyPass: string = '';
    currentUrl: string = '';
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
        @Inject(PLATFORM_ID) private platformId: Object,
        private _translateService: TranslateService, 
        private _apiService: ApiService, 
        private _notificationService: NotificationService, 
        private _clipboardService: ClipboardService,
        public _satin: DomSanitizer,
        private _media: MediaService,  
        private _metaTags: Meta,
        private route: ActivatedRoute,
        private _route: Router,
        private _location: Location,
        private readonly _title: Title,){
         //Para registro con codigo qr    
         this.route.params.subscribe(params => { 
            if(params){
                this.productId = params.id;
            }
        });

        _route.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
              this.previousUrl = this.currentUrl;
              this.currentUrl = event.url;
            };
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
                var urlWindowLocation: any = '';
                if(isPlatformBrowser(this.platformId)){
                    this.urlbyPass = `https://${ window.location.hostname }/marketplace/item/${productId}`
                }else{
                    this.urlbyPass = `https://plaquitascr.com/marketplace/item/${productId}`

                }

                const textMessageLink = `Hola. ¿Sigue estando disponible?%0ALink:%0A ${this.urlbyPass}`

                this.textMessageLink = `https://wa.me/${this.getFlag(this.payloadData.country)}${this.removeRegex(this.payloadData.phone)}?text=${textMessageLink}`


                this._title.setTitle(`${ this.TranslateText(this.payloadData.productName)} | Plaquitas CR `)
                this._metaTags.updateTag({ property: 'og:title', content: this.payloadData.productName }); 
                this._metaTags.updateTag({ property: 'og:url', content: urlWindowLocation }); 
                this._metaTags.updateTag({ property: 'og:image', content: this.payloadData.images[0].imageURL });
                this._metaTags.updateTag({ property: 'og:image:secure_url', content: this.payloadData.images[0].imageURL });
                this._metaTags.updateTag({ property: 'og:image:type', content: 'image/png' });
                this._metaTags.updateTag({ property: 'og:image:width', content: '300' });
                this._metaTags.updateTag({ property: 'og:image:height', content: '300' });
                this._metaTags.updateTag({ property: 'og:description', content: this.payloadData.metaDescription });
                this._metaTags.updateTag({ name: 'description', content: this.payloadData.metaDescription });

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

    backToHome() {
        if(isPlatformBrowser(this.platformId)){
            if (window.history.length > 1) {
                this._location.back()
            } else {
                this._route.navigate([this.previousUrl])
            }
        }else{
            this._route.navigate([this.previousUrl])
        }
    }

    copyURL(text:string){
        this._clipboardService.copy(text);
        this._notificationService.success('Text copied..!', 'bg-success', 'animate__backInUp', 6000);
    }
}
