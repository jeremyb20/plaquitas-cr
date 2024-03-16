import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CatalogStatusList, CategoryList, Product } from '@methods/constants';
import { GetMethods, generateRandomNumber, getSeverity, responseError } from '@methods/methods';
import { Filters, ResponseData } from '@models/models';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from '@services/api.service';
import { MediaResponse, MediaService } from '@services/media.service';
import { NotificationService } from '@services/notification.service';
import { ThemeService } from '@services/theme.service';
import { SelectItem } from 'primeng/api';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DataView } from 'primeng/dataview';

@Component({
  selector: 'app-marketplace',
  templateUrl: './marketplace.component.html',
  styleUrls: ['./marketplace.component.scss']
})
export class MarketplaceComponent implements OnInit {
    @ViewChild('dv') dv!: DataView;
    
    private mediaSubscription: Subscription;
    Media: MediaResponse;
    isNavbarTransparent = true;
    sidebarVisible: boolean = false;
    products!: Product[];
    productsPromo: Product[]; 
    sortOptions!: SelectItem[];
    categoryList: Filters[];
    statusList: Filters[];
    sortOrder!: number;

    sortField!: string;
    
    layout: any = 'list';
    responsiveOptions: any[] | undefined;
    year:any;
    loading: boolean = false;
    displayBasic: boolean = false;
    showFilterInputs: boolean = false;
    productSelected: any;

    showHardReloadBtn: boolean = false;
    randomNumber: number = generateRandomNumber(1, 5);

    constructor(
        private media: MediaService,
        private _notificationService: NotificationService,
        private _apiService: ApiService,
        private _themeService: ThemeService,
        private _router: Router,
        private _translateService: TranslateService) {
        this.mediaSubscription = this.media.subscribeMedia().subscribe(result => {
            this.Media = result;
        });
        const moonLanding = new Date();
        this.year = moonLanding.getFullYear();
    }

    ngOnInit() {
        const theme = this._themeService.getThemeSelected();
        this._themeService.setTheme(theme ? theme : 'theme-default-light');
        this.categoryList = CategoryList;
        this.statusList = CatalogStatusList;
        this.getInicialRequest(1); 
        // this.getInicialRequest(2); 
        this.sortOptions = [
            { label: 'Price High to Low', value: '!price' },
            { label: 'Price Low to High', value: 'price' }
        ];
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
    }

    openMoreInfo(product: any){
        this._router.navigate(['/marketplace/item/'+ product._id],);
        // this.productSelected = [];
        // this.productSelected = product;
        // this.sidebarVisible = true;
    }

    hardRefresh(){
        location.reload();
    }

    closeSidebar(){
        this.productSelected = null;
        this.displayBasic = false;
        this.sidebarVisible = false;
    }

    onSortChange(event: any) {
        let value = event.value;

        if (value.indexOf('!') === 0) {
            this.sortOrder = -1;
            this.sortField = value.substring(1, value.length);
        } else {
            this.sortOrder = 1;
            this.sortField = value;
        }
    }

    getInicialRequest(typeReq: number){
        this.loading = true;
        const URL = `${environment.WebApiUrl + this.getUrlApiRequest(typeReq)}`;
        this._apiService.apiGetMethod(URL).subscribe({
            next: (result: ResponseData) => {
                if(typeReq == 1){
                    this.products = result.payload;
                }
                if(typeReq == 2){
                    this.productsPromo = result.payload; 
                }
                this.loading = false;
            },
            error: (err: any) => {
                console.log(err);
                this.loading = false;
                const messageTypeErrorText = responseError(err.status);
                this._notificationService.error(messageTypeErrorText, 'bg-dark', 'animate__backInUp', 6000);
            }
        });
    }

 

    getUrlApiRequest(typeReq: number){
        switch (typeReq) {
            case 1: return GetMethods.GET_ALL_CATALOG_LIST;
            case 2: return GetMethods.GET_ALL_PROMO_LIST;
    
            default: return null;
        }
    }

    removeRegex(phoneNumber){
        if(phoneNumber)
        return phoneNumber.replace(/-/g, '');
    }

    Myfilter(filter: string, filterMatchMode:string = "contains" ) {
        this.dv.filter( filter, filterMatchMode );
        // free to do anything here
    }

    MyfilterCategory(filter: string, filterMatchMode:string = "equals" ) {
        this.dv.filter( filter, filterMatchMode );
        // free to do anything here
    }

    getSeverity(statusProduct: any){
        return getSeverity(statusProduct)
    }

    TranslateText(text: string) {
        return this._translateService.instant(text);
    } 
}
