import { AUTO_STYLE, animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { GoogleMap, MapInfoWindow, MapMarker } from '@angular/google-maps';
import { Router } from '@angular/router';
import { GetMethods, PutMethods, responseError } from '@methods/methods';
import { PointMap, ResponseData } from '@models/models';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from '@services/api.service';
import { MediaResponse, MediaService } from '@services/media.service';
import { NotificationService } from '@services/notification.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

const DEFAULT_DURATION = 300;

@Component({
    selector: 'app-google-maps',
    templateUrl: './google-maps.component.html',
    animations: [
        trigger('collapse', [
            state('false', style({ height: AUTO_STYLE, visibility: AUTO_STYLE })),
            state('true', style({ height: '0', visibility: 'hidden' })),
            transition('false => true', animate(DEFAULT_DURATION + 'ms ease-in')),
            transition('true => false', animate(DEFAULT_DURATION + 'ms ease-out'))
        ])
    ]
})
export class GoogleMapsComponent implements OnInit {
    @ViewChild(GoogleMap, { static: false }) map: GoogleMap;
    @ViewChild(MapInfoWindow, { static: false }) infoWindow: MapInfoWindow;
    @ViewChildren(MapMarker) markers: QueryList<MapMarker>;

    points: PointMap[] = [];
    dataContent: any;
    options = {
        zoomControl: true,
        scrollwheel: true, 
        gestureHandling: "greedy",
        maxZoom: 20,
        minZoom: 6,
    };
    id: number = 1;

    userLogin: any;

    pet: any;
    users: any;
    Media: MediaResponse;
    loading: boolean = false;
    zoom: number = 12;
    display: any;
    center: google.maps.LatLngLiteral = {
        lat: 9.93040049002793,
        lng: -84.09062837772197
    };
    markerOptions: google.maps.MarkerOptions = { draggable: true, clickable: true, animation: google.maps.Animation.DROP };
    markerPositions: google.maps.LatLngLiteral[] = [];


    constructor( private media: MediaService,
        private _notificationService: NotificationService,
        private router: Router,
        private _translateService: TranslateService,
        private _apiService: ApiService) {}

    ngOnInit() {
        this.userLogin = JSON.parse(localStorage.getItem('user')!);
        if(this.userLogin){
           this.getAllPetLocationList(); 
        }   
    }

    getAllPetLocationList() {

        const URL = `${environment.WebApiUrl + GetMethods.ADMIN_GET_ALL_LOCATION_PETS}`;

        this._apiService.apiGetMethod(URL).subscribe({
          next: (result: any) => {
            this.users = result;

            const dataoptions: any = []

            this.users.forEach(element => {

                const icon = {
                    url: element.photo, // url
                    scaledSize: new google.maps.Size(30, 30), // scaled size
                    origin: new google.maps.Point(0, 0), // origin
                    anchor: new google.maps.Point(0, 0), // anchor
                    draggable: true
                };

                dataoptions.push({
                    data: element,
                    position: {
                        lat: parseFloat(element.lat),
                        lng: parseFloat(element.lng),
                    },
                    label: {
                        color: 'red',
                        text: 'Marker label ' + (this.markers.length + 1),
                    },
                    title: 'maps-icon',
                    options: { draggable: true, animation: google.maps.Animation.DROP, icon: icon },
                });
            });

            this.points = dataoptions;
              
          },
          error: (err: any) => {
            console.log(err);
            const messageTypeErrorText = responseError(err.status);
            this._notificationService.error(messageTypeErrorText, 'bg-dark', 'animate__backInUp', 6000);
          }
        });
    }

    showPanel(item: any) {
        item.showPanel = !item.showPanel;
    }

    openInfo(windowIndex: number, content: any) {
        this.markers.forEach((marker: MapMarker, ix: number) => {
            if (windowIndex === ix) {
                this.dataContent = content.data;
                this.infoWindow.open(marker);
            }
        });
    }

    zoomIn() {
        if (this.zoom < this.options.maxZoom) this.zoom++;
    }
    
    zoomOut() {
        if (this.zoom > this.options.minZoom) this.zoom--;
    }

    openWaze(lat: any, lng: any){
        const link = "https://waze.com/ul?q=" + lat + "," + lng + "&navigate=yes&zoom=17";
        window.open(link, '_blank')
    }

    click(event: google.maps.MapMouseEvent) {
        console.log(event.latLng?.lat());
        console.log(event.latLng?.lng());
        const latitude: any = event.latLng?.lat();
        const lang: any = event.latLng?.lng();

        // this.points.push({
        //     position: {
        //       lat: latitude,
        //       lng: lang
        //     },
        //     label: {
        //       color: 'red',
        //       text: 'Marker label ' + (this.markers.length + 1),
        //     },
        //     title: 'Marker title ' + (this.markers.length + 1), 
        //     options: {
        //       animation: google.maps.Animation.DROP,
        //     },
        //   });
    }

    getMyCurrentPosition(){
        navigator.geolocation.getCurrentPosition((position) => {
            this.center = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };

            this.points.push({
                position: {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                },
                label: {
                    color: 'red',
                    text: 'Marker label ' + (this.markers.length + 1),
                },
                title: 'Marker title ' + (this.markers.length + 1),
                options: {
                    animation: google.maps.Animation.DROP,
                },
            });
        });
    }

    onDragend(m, event){ 

        Swal.fire({
            text: this.TranslateText('Are you sure?'),
            icon: 'warning',
            showCancelButton: true,
            cancelButtonText: this.TranslateText('No'),
            confirmButtonText: this.TranslateText('Yes'),
            allowOutsideClick: false
        }).then((result) => {
            if (result.isConfirmed) {
                const data = {
                    idPrimary : m.data.idPrimary,
                    idSecondary: m.data._id,
                    lat: event.latLng?.lat(),
                    lng: event.latLng?.lng()
                }
                const URL = `${environment.WebApiUrl + PutMethods.ADMING_UPDATE_LOCATION_PET }`;

                this._apiService.apiPutMethod(URL, data).subscribe({
                    next: (result: ResponseData) => {
                        if (result.success) {  
                            this._notificationService.success(result.msg, 'bg-success', 'animate__backInUp', 6000);
                        }else{
                            this._notificationService.warning(result.msg, 'bg-dark', 'animate__backInUp', 6000);
                        }
                    },
                    error: (err: ResponseData) => {
                        console.log(err);
                        this._notificationService.warning('An error occurred in the process.', 'bg-dark', 'animate__backInUp', 6000);
                    }
                });

            }
        })
    }

    TranslateText(text: string) {
        return this._translateService.instant(text);
    } 
}
