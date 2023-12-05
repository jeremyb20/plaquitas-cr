import { Component, Input, OnInit } from '@angular/core';
import { transformMediumDate } from '@methods/methods';
import { MediaResponse, MediaService } from '@services/media.service';
import { Subscription } from 'rxjs/internal/Subscription';

@Component({
  selector: 'app-digital-identification',
  templateUrl: './digital-identification.component.html'
})
export class DigitalIdentificationComponent implements OnInit {
    @Input() payloadData: any;
    @Input() AngularxQrCode: any;

    private mediaSubscription: Subscription;
    Media: MediaResponse;

    constructor( private _media: MediaService){
        this.mediaSubscription = this._media.subscribeMedia().subscribe(media => {
            this.Media = media;
        });
    }

    ngOnInit(): void {
        
    }

    transformDate(date: any) {
        return transformMediumDate(date);
    }
}
