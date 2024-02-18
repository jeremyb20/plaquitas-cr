import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GetMethods, calcularEdadPerro, calcularEdadPerroDesdeHumano, calculateAge, responseError, transformDate, transformMediumDate } from '@methods/methods';
import { User } from '@models/auth-model';
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

    constructor(@Inject(DOCUMENT) private document: Document,
        private route: ActivatedRoute, 
        private _media: MediaService, 
        private _apiService: ApiService,
        private router: Router,
        private _clipboardService: ClipboardService,
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
        this.AngularxQrCode = 'https://' + window.location.hostname + '/myPetCode/' + this.primaryId +'/'+ this.secondaryId;
        this._apiService.apiGetMethod(URL).subscribe({
            next: (result: ResponseData) => {
                if(result.success){
                    if(result.payload.isActivated){
                        this.router.navigate(['/register-pets/'],{ queryParams: {id: this.primaryId, idSecond: this.secondaryId, isActivated: result.payload.isActivated}}); 
                        return;
                    }

                    this.payloadData = result.payload;

                    let ogImageMetaTag = this.document.querySelector('meta[property="og:image"]') as HTMLMetaElement | null;
                    if (ogImageMetaTag) {
                    // Cambia el contenido de la etiqueta og:image
                    const nuevaURLImagen = this.payloadData.photo;
                    ogImageMetaTag.content = nuevaURLImagen;
                    } else {
                        // Si no se encuentra la etiqueta, puedes crearla y agregarla al head
                        const nuevaMetaTag = document.createElement('meta');
                        nuevaMetaTag.setAttribute('property', 'og:image');
                        nuevaMetaTag.content = this.payloadData.photo;
                    
                        // Obtén el head del documento y añade la nueva etiqueta meta
                        const head = document.head || document.getElementsByTagName('head')[0];
                        head.appendChild(nuevaMetaTag);
                    }

                    let ogDescriptionMetaTag = this.document.querySelector('meta[property="og:description"]') as HTMLMetaElement | null;
                    if (ogDescriptionMetaTag) {
                        // Cambia el contenido de la etiqueta og:image
                        ogDescriptionMetaTag.content = '¡Hola! Soy ' + this.payloadData.petName +'. Para conocer todos los detalles de mi cédula canina, visita el link que esta abajo. 👇';
                        } else {
                            // Si no se encuentra la etiqueta, puedes crearla y agregarla al head
                            const nuevaMetaTag = document.createElement('meta');
                            nuevaMetaTag.setAttribute('property', 'og:image');
                            nuevaMetaTag.content = '¡Hola! Soy ' + this.payloadData.petName +'. Para conocer todos los detalles de mi cédula canina, visita el link que esta abajo. 👇';
                        
                            // Obtén el head del documento y añade la nueva etiqueta meta
                            const head = document.head || document.getElementsByTagName('head')[0];
                            head.appendChild(nuevaMetaTag);
                        }
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
        var text: string = 'https://'+ window.location.hostname + '/myPetCode?id=' + this.primaryId +'&idSecond='+ this.secondaryId;;
        this._clipboardService.copy(text);
        this._notificationService.success('Text copied..!', 'bg-success', 'animate__backInUp', 6000);
    }
}

