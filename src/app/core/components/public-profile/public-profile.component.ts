import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, Input, OnInit, PLATFORM_ID, NgZone } from '@angular/core'; 
import { PutMethods, calcularEdadPerroDesdeHumano, calculateAge, changeThemeValidation } from '@methods/methods';
import { ResponseData } from '@models/models';
import { ApiService } from '@services/api.service';
import { MediaResponse, MediaService } from '@services/media.service';
import { NotificationService } from '@services/notification.service';
import { ThemeService } from '@services/theme.service';
import { ClipboardService } from 'ngx-clipboard';
import { Subscription } from 'rxjs/internal/Subscription';
import { environment } from 'src/environments/environment';

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
    locationPermissionDenied: boolean = true;

    private mediaSubscription: Subscription;
    Media: MediaResponse;

    constructor( 
        private _media: MediaService,
        private _clipboardService: ClipboardService, 
        private _themeService: ThemeService,
        private _notificationService: NotificationService,
        private _apiService: ApiService,
        private ngZone: NgZone,
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
        this.checkLocationPermission();
    }

    checkLocationPermission() {
        if(isPlatformBrowser(this.platformId)){
            if (navigator.permissions) {
                navigator.permissions.query({ name: 'geolocation' }).then((permissionStatus) => {
                    if (permissionStatus.state === 'denied') {
                    this.ngZone.run(() => {
                        this.locationPermissionDenied = true;
                    });
                    }else{
                        this.activateLocation()
                    }
                });
            }
        } 
      }
    
    activateLocation() {
        if(isPlatformBrowser(this.platformId)){
            navigator.geolocation.getCurrentPosition((position) => {
                this.ngZone.run(() => {
                    this.locationPermissionDenied = false;
                }); 
                this.updatePetView( position.coords.latitude, position.coords.longitude);
    
            }, (error) => {
                console.error('Error getting location:', error);
                this.checkLocationPermission();
            });
        }
    }

     
    updatePetView(lat: number, lng: number){
        const URL = `${environment.WebApiUrl + PutMethods.USER_UPDATE_PET_VIEWED }`;
        const data = {
            lat: lat,
            lng: lng,
            dateViewed: new Date(),
            _id: this.primaryId,
            secondaryId: this.payloadData._id
        }
        this._apiService.apiPutMethod(URL, data).subscribe({
            next: (result: ResponseData) => {
                console.log(result);
            },
            error: (err: any) => {
                console.log(err);
                this._notificationService.warning('An error occurred in the process.', 'bg-dark', 'animate__backInUp', 6000);
            }
        });
    }

    openChromeSettings() {
        if(isPlatformBrowser(this.platformId)){
            window.location.href = "chrome://settings/content/location";
        }else{
            this.checkLocationPermission()
        }
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
