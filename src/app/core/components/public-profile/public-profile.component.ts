import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { calcularEdadPerroDesdeHumano, calculateAge, changeThemeValidation } from '@methods/methods';
import { MediaResponse, MediaService } from '@services/media.service';
import { NotificationService } from '@services/notification.service';
import { ThemeService } from '@services/theme.service';
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
    showDarkMode: boolean = false;


    private mediaSubscription: Subscription;
    Media: MediaResponse;

    constructor( 
        private _media: MediaService,
        private _clipboardService: ClipboardService, 
        private _themeService: ThemeService,
        private _notificationService: NotificationService,
        @Inject(PLATFORM_ID) private platformId: Object,
        ){
        this.mediaSubscription = this._media.subscribeMedia().subscribe(media => {
            this.Media = media;
        });
    }

    ngOnInit(): void {
        const theme = this._themeService.getThemeSelected();
        this._themeService.setTheme(theme ? theme : 'theme-default-light');
        this.showDarkMode = changeThemeValidation(theme); 
    }

    changeTheme(eventTheme){ 
        this.showDarkMode = eventTheme.checked; 
        this._themeService.setTheme(eventTheme.checked ? 'theme-default-dark' : 'theme-default-light');
    }

    copy(){
        var text: string = '';
        if(isPlatformBrowser(this.platformId)){
            text = 'https://' + window.location.hostname + '/pet/' + this.primaryId +'/'+ this.secondaryId; 
        }else{
            text = 'https://' + 'plaquitascr.com' + '/pet/' + this.primaryId +'/'+ this.secondaryId; 

        }
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
