import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GetMethods, calcularEdadPerro, calcularEdadPerroDesdeHumano, calculateAge, responseError, transformDate, transformMediumDate } from '@methods/methods';
import { User } from '@models/auth-model';
import { ResponseData } from '@models/models';
import { ApiService } from '@services/api.service';
import { MediaResponse, MediaService } from '@services/media.service';
import { NotificationService } from '@services/notification.service';
import { ClipboardService } from 'ngx-clipboard';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';

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

    constructor(private route: ActivatedRoute, 
        private _media: MediaService, 
        private _apiService: ApiService,
        private _clipboardService: ClipboardService,
        private _notificationService: NotificationService){
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
        this.AngularxQrCode = 'https://www.localpetsandfamily.com/myPetCode?id=' + this.primaryId +'&idSecond='+ this.secondaryId;
        this._apiService.apiGetMethod(URL).subscribe({
            next: (result: ResponseData) => {
                console.log(result)
                if(result.success){
                    this.payloadData = result.payload.data;
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
        var text: string = 'https://www.localpetsandfamily.com/myPetCode?id=' + this.primaryId +'&idSecond='+ this.secondaryId;;
        this._clipboardService.copy(text);
        this._notificationService.success('Text copied..!', 'bg-success', 'animate__backInUp', 6000);
    }
}

