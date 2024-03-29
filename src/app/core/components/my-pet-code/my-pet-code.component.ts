import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { GetMethods, calcularEdadPerro, calcularEdadPerroDesdeHumano, calculateAge, getCountryCode, responseError, transformDate, transformMediumDate } from '@methods/methods';
import { ResponseData } from '@models/models';
import { ApiService } from '@services/api.service';
import { MediaResponse, MediaService } from '@services/media.service';
import { NotificationService } from '@services/notification.service';
import { ClipboardService } from 'ngx-clipboard';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-my-pet-code',
  templateUrl: './my-pet-code.component.html'
})
export class MyPetCodeComponent implements OnInit{
    private mediaSubscription: Subscription;
    Media: MediaResponse;
    showEditBtnEvent: boolean;
    isPublicProfile: boolean = true;
    primaryId: any;
    secondaryId: any;
    payloadData: any;
    humanAge: number = 0;
    AngularxQrCode: string = '';
    textMessageLink: any = ''
    urlWindowLocation: any = '';

    constructor(@Inject(DOCUMENT) private document: Document,
        @Inject(PLATFORM_ID) private platformId: Object,
        private route: ActivatedRoute, 
        private _media: MediaService, 
        private _apiService: ApiService,
        private router: Router,
        private _clipboardService: ClipboardService,
        private readonly _title: Title,
        private _metaTags: Meta,
        private _notificationService: NotificationService){

        //Para registro con codigo qr    
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

        this.mediaSubscription = this._media.subscribeMedia().subscribe(media => {
            this.Media = media;
        });
    }

    ngOnInit(): void {
        this.getMyPetCode()
    }

    getMyPetCode(){
        const URL = `${environment.WebApiUrl + GetMethods.GET_MY_PET_CODE_BY_ID + '?id=' + this.primaryId + '&idSecond=' + this.secondaryId }`;
        this._apiService.apiGetMethod(URL).subscribe({
            next: (result: ResponseData) => {
                if(result.success){
                    if(result.payload.isActivated){
                        this.router.navigate(['/register-pets/'],{ queryParams: {id: this.primaryId, idSecond: this.secondaryId, isActivated: result.payload.isActivated}}); 
                        return;
                    }

                    this.router.navigate(['/pet/' + this.primaryId + '/' + this.secondaryId])
                    
                }else{
                    if(result.msg == 'User not found'){
                        let timerInterval;
                        Swal.fire({
                            title: 'Error de enrutamiento!',
                            html: 'Prece que el link no está disponible o ya caducó. Se enviará al inicio en <b>' + timerInterval + '</b> millisegundos.',
                            timer: 7000,
                            timerProgressBar: true,
                            allowOutsideClick: false,
                            didOpen: () => {
                                Swal.showLoading();
                                const timer: any = Swal.getPopup()?.querySelector("b");
                                timerInterval = setInterval(() => {
                                    timer.textContent = `${Swal.getTimerLeft()}`;
                                }, 100);
                            },
                            willClose: () => {
                                clearInterval(timerInterval);
                            }
                        }).then((result) => {
                            /* Read more about handling dismissals below */
                            if (result.dismiss === Swal.DismissReason.timer) {
                                this.router.navigate(['/login']);
                            }
                        });
                    }
                }
            },
            error: (err: any) => {
                console.log(err);
                const messageTypeErrorText = responseError(err.status);
                this._notificationService.error(messageTypeErrorText, 'bg-dark', 'animate__backInUp', 6000);
            }
        });
    }

    calculateAge(date){
        this.humanAge = calculateAge(date);
        return this.humanAge;
    }

    getFlag(country: string){
        return getCountryCode(country);
    }


    removeRegex(phoneNumber){
        if(phoneNumber)
        return phoneNumber.replace(/-/g, '');
    }

    calculatePetAge(date){
        return calcularEdadPerro(date);
    }

    transformDate(date: any) {
        return transformMediumDate(date);
    }

    calcularEdadPerroDesdeHumano(){
        return calcularEdadPerroDesdeHumano(this.humanAge)
    }

    copy(){
        var text: string = 'https://'+ window.location.hostname + '/pet/' + this.primaryId +'/'+ this.secondaryId;;
        this._clipboardService.copy(text);
        this._notificationService.success('Text copied..!', 'bg-success', 'animate__backInUp', 6000);
    }
}

