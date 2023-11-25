import { AUTO_STYLE, animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { GoogleMap, MapInfoWindow, MapMarker } from '@angular/google-maps';
import { Router } from '@angular/router';
import { GetMethods, responseError } from '@methods/methods';
import { PointMap } from '@models/models';
import { ApiService } from '@services/api.service';
import { MediaResponse, MediaService } from '@services/media.service';
import { NotificationService } from '@services/notification.service';
import { environment } from 'src/environments/environment';

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
        disableDoubleClickZoom: false,
        maxZoom: 15,
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
    markerOptions: google.maps.MarkerOptions = { draggable: false, clickable: true, animation: google.maps.Animation.DROP };
    markerPositions: google.maps.LatLngLiteral[] = [];


    constructor( private media: MediaService, private _notificationService: NotificationService, private router: Router, private _apiService: ApiService) {}

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
                    anchor: new google.maps.Point(0, 0) // anchor
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
                    options: { animation: google.maps.Animation.DROP, icon: icon },
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
}
