import { Component, Input, OnInit } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { calcularEdadPerroDesdeHumano, calculateAge } from '@methods/methods';
import { MediaResponse, MediaService } from '@services/media.service';
import { NotificationService } from '@services/notification.service';
import { ClipboardService } from 'ngx-clipboard';
import { Subscription } from 'rxjs/internal/Subscription';

@Component({
  selector: 'app-public-profile',
  templateUrl: './public-profile.component.html'
})
export class PublicProfileComponent implements OnInit {
    @Input() payloadData: any;
    @Input() AngularxQrCode: any;
    @Input() primaryId: any;
    @Input() secondaryId: any;
    humanAge: number = 0;

    private mediaSubscription: Subscription;
    Media: MediaResponse;

    constructor( 
        private _media: MediaService,
        private _clipboardService: ClipboardService, 
        private _notificationService: NotificationService, 
        private _metaTags: Meta
        ){
        this.mediaSubscription = this._media.subscribeMedia().subscribe(media => {
            this.Media = media;
        });
    }

    ngOnInit(): void {
        this._metaTags.updateTag
    }

    copy(){
        var text: string = 'https://www.localpetsandfamily.com/myPetCode?id=' + this.primaryId +'&idSecond='+ this.secondaryId;
        this._clipboardService.copy(text);
        this._notificationService.success('Text copied..!', 'bg-success', 'animate__backInUp', 6000);
    }

    calculateAge(date: any){
        this.humanAge = calculateAge(date);
        return this.humanAge;
    }

    removeRegex(phoneNumber){
        return phoneNumber.replace(/-/g, '');
    }

    calcularEdadPerroDesdeHumano(){
        return calcularEdadPerroDesdeHumano(this.humanAge)
    }

}
