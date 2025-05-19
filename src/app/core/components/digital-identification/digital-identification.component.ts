import { isPlatformBrowser } from '@angular/common';
import { Component, Input, OnInit, NgZone, PLATFORM_ID, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PutMethods, transformMediumDate } from '@methods/methods';
import { ResponseData } from '@models/models';
import { ApiService } from '@services/api.service';
import { MediaResponse, MediaService } from '@services/media.service';
import { NotificationService } from '@services/notification.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-digital-identification',
  templateUrl: './digital-identification.component.html'
})
export class DigitalIdentificationComponent implements OnInit {
    @Input() payloadData: any;
    @Input() AngularxQrCode: any;
    @Input() primaryId: any;
    @Input() secondaryId: any;

    private mediaSubscription: Subscription;
    Media: MediaResponse;
    locationPermissionDenied: boolean = true;
    isAppleDevice: boolean = false;

    constructor( 
        private _media: MediaService,
        private _notificationService: NotificationService,
        private _apiService: ApiService,
        private ngZone: NgZone,
        private route: ActivatedRoute, 
        @Inject(PLATFORM_ID) private platformId: Object,
    ){
        this.mediaSubscription = this._media.subscribeMedia().subscribe(media => {
            this.Media = media;
        }); 

        // Para registro con codigo qr    
        this.route.params.subscribe(params => {
            this.primaryId = params.id;
            this.secondaryId = params.idSecond;
        });

        if(this.primaryId === undefined){
            this.route.queryParams.subscribe(params => { 
                this.primaryId = params.id;
                this.secondaryId = params.idSecond;
            });
        }

        // Detectar si es dispositivo Apple
        if(isPlatformBrowser(this.platformId)){
            this.isAppleDevice = /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform);
        }
    }

    ngOnInit(): void {
        if (this.isAppleDevice) {
            // Saltar verificación de permisos para dispositivos Apple
            this.locationPermissionDenied = false;
            this.activateLocation();
        } else {
            // Realizar verificación normal para otros dispositivos
            this.checkLocationPermission();
        }
    }

    checkLocationPermission() { 
        if(isPlatformBrowser(this.platformId)){
            if (navigator.permissions) {
                navigator.permissions.query({ name: 'geolocation' }).then((permissionStatus) => {
                    if (permissionStatus.state === 'denied') {
                        this.ngZone.run(() => {
                            this.locationPermissionDenied = true;
                        });
                    } else {
                        this.activateLocation();
                    }
                });
            } else {
                // Navegadores que no soportan la API de permisos
                this.activateLocation();
            }
        }
    }
    
    activateLocation() {
        if(isPlatformBrowser(this.platformId)){
            navigator.geolocation.getCurrentPosition((position) => {
                this.ngZone.run(() => {
                    this.locationPermissionDenied = false;
                }); 
                this.updatePetView(position.coords.latitude, position.coords.longitude);
            }, (error) => {
                console.error('Error getting location:', error);
                if (!this.isAppleDevice) {
                    this.checkLocationPermission();
                }
            });
        }
    }

    updatePetView(lat: number, lng: number){
        const URL = `${environment.WebApiUrl + PutMethods.USER_UPDATE_PET_VIEWED}`;
        if(this.primaryId){
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
    }

    openChromeSettings() {
        if(isPlatformBrowser(this.platformId) && !this.isAppleDevice){
            window.location.href = "chrome://settings/content/location";
        } else {
            if (!this.isAppleDevice) {
                this.checkLocationPermission();
            }
        }
    }

    transformDate(date: any) {
        return transformMediumDate(date);
    }
}