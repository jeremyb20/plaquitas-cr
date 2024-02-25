import { Component, Input } from '@angular/core';
import { Product } from '@methods/constants';
import { getSeverity } from '@methods/methods';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';


@Component({
  selector: 'app-market-item',
  templateUrl: './market-item.component.html',
  styleUrls: ['./market-item.component.scss']
})
export class MarketItemComponent {
    @Input() images: Product;
    @Input() displayBasic: boolean = false;

    payloadData: Product;

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

    constructor(private _translateService: TranslateService){

    }

    ngOnInit(): void {
        //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
        //Add 'implements OnInit' to the class.
        console.log(this.images)
        this.payloadData = this.images;
        moment.locale('es')

        this.dayPublished = moment(this.payloadData.createdAt).fromNow(); 
        this.dayUpdated = moment(this.payloadData.updatedAt).fromNow(); 
    }

    removeRegex(phoneNumber){
        if(phoneNumber)
        return phoneNumber.replace(/-/g, '');
    }


    getSeverity(statusProduct: any){
        return getSeverity(statusProduct)
    }

    TranslateText(text: string) {
        return this._translateService.instant(text);
    } 
}
