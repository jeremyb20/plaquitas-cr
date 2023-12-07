import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GetMethods, responseError } from '@methods/methods';
import { ResponseData } from '@models/models';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from '@services/api.service';
import { MediaResponse, MediaService } from '@services/media.service';
import { NotificationService } from '@services/notification.service';
import { BarcodeFormat } from '@zxing/library';
import { ClipboardService } from 'ngx-clipboard';
import { Subscription } from 'rxjs';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
declare var bootstrap: any;


@Component({
    selector: 'app-scanner',
    templateUrl: './scanner.component.html'
})
export class ScannerComponent {
    mediaSubscription: Subscription;
    Media: MediaResponse;

    petProfileScanner: any;
    payloadData: any;
    primaryId: any;
    secondaryId: any;

    availableDevices: MediaDeviceInfo[];
    currentDevice: any = MediaDeviceInfo;

    formatsEnabled: BarcodeFormat[] = [
        BarcodeFormat.CODE_128,
        BarcodeFormat.DATA_MATRIX,
        BarcodeFormat.EAN_13,
        BarcodeFormat.QR_CODE,
    ];

    hasDevices: boolean = true;
    hasPermission: boolean;
    showScanner: boolean = true;

    qrResultString: any;

    torchEnabled = false;
    torchAvailable$ = new BehaviorSubject<boolean>(false);
    tryHarder = false;

    constructor(
        private _mediaService: MediaService,
        private _apiService: ApiService, 
        private _notificationService: NotificationService, 
        private _router: Router,
        private _translateService: TranslateService, 
        private _clipboardService: ClipboardService) {
        this.mediaSubscription = this._mediaService.subscribeMedia().subscribe(media => {
            this.Media = media;
        });
    }

    clearResult(): void {
        this.qrResultString = null;
    }

    onCamerasFound(devices: MediaDeviceInfo[]): void {
        this.availableDevices = devices;
        this.hasDevices = Boolean(devices && devices.length);
    }

    onCodeResult(resultString: string) {
        this.qrResultString = resultString;
        var codigo = this.qrResultString.replace(/.*\/myPetCode\//, '');
        const stateResponse = codigo.split('/');
        this.primaryId = stateResponse[0];
        this.secondaryId = stateResponse[1];

        if(this.secondaryId != ''){
            const URL = `${environment.WebApiUrl + GetMethods.GET_USR_PROFILE_BY_SCANNER + this.primaryId + '/'+ this.secondaryId}`;
            this._apiService.apiGetMethod(URL).subscribe({
                next: (result: ResponseData) => {
                    if (result.success) {
                        this.payloadData = result.payload;
                        this.showScanner = true;
                        this.petProfileScanner = new bootstrap.Modal(document.getElementById('petProfileScanner'), {
                            keyboard: false
                        })
                        this.petProfileScanner.show()
                    }else{
                        this.showScanner = false;
                        Swal.fire({
                            position: 'center',
                            icon: 'error',
                            title: 'Oops...',
                            text: result.msg,
                            confirmButtonText: 'OK',
                        }).then((result) => {
                            if (result.isConfirmed) {
                                this.showScanner = true;
                            }
                        })
                    }
                },
                error: (err: any) => {
                    console.log(err);
                    const messageTypeErrorText = responseError(err.status);
                    this._notificationService.error(messageTypeErrorText, 'bg-dark', 'animate__backInUp', 6000);
                }
            });
        }else{
            this.showScanner = false;
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Oops...',
                text: this.TranslateText('User Not Found'),
                confirmButtonText: 'OK',
            }).then((result) => {
                if (result.isConfirmed) {
                    this.showScanner = true;
                }
            })
        }
    }


    TranslateText(text: string) {
        return this._translateService.instant(text);
    } 

    openExternalProfile(idPrimary: any, idSecondary: any) {
        const url = this._router.createUrlTree(['/myPetCode/'],{ queryParams: { id: idPrimary, idSecond: idSecondary }})
        window.open(url.toString(), '_blank')
    }

    copy(text: string){
        this._clipboardService.copy(text);
        this._notificationService.success('Text copied..!', 'bg-success', 'animate__backInUp', 6000);
    }

    cancel(){
        this.showScanner = true;
        this.petProfileScanner.hide();
    }

    onDeviceSelectChange(selected: string) {
        const device = this.availableDevices.find(x => x.deviceId === selected);
        this.currentDevice = device || null;
    }
    onHasPermission(has: boolean) {
        this.hasPermission = has;
    }

    onTorchCompatible(isCompatible: boolean): void {
        this.torchAvailable$.next(isCompatible || false);
    }

    toggleTorch(): void {
        this.torchEnabled = !this.torchEnabled;
    }

    toggleTryHarder(): void {
        this.tryHarder = !this.tryHarder;
    }
}
