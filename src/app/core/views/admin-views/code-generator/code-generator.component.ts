import { Component, OnInit, ViewChild } from '@angular/core';
import { ColumHeader, StatusFilter } from '@methods/constants';
import { DeleteMethods, GetMethods, PostMethods, PutMethods, generateCodeRandom, generateRandomNumber, getStatusType, responseError, transformDate } from '@methods/methods';
import { Filters, ResponseData } from '@models/models';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from '@services/api.service';
import { NotificationService } from '@services/notification.service';
import { ThemeService } from '@services/theme.service';
import { environment } from 'src/environments/environment';
import { saveAs } from 'file-saver-es';
import { ClipboardService } from 'ngx-clipboard';
import { ChartOptions } from 'chart.js';
import Swal from 'sweetalert2';
import { MediaResponse, MediaService } from '@services/media.service';
import { Subscription } from 'rxjs';
declare const bootstrap: any;


@Component({
    selector: 'app-code-generator',
    templateUrl: './code-generator.component.html',
})
export class CodeGeneratorComponent implements OnInit {

    //Chart Variables Pie Chart //
    public pieChartOptions: ChartOptions<'pie'> = {
        responsive: false,
    };
    public pieChartLabels: string[] =  [ 'Preparing' , 'Finished', 'Pendings', 'Starting' ];
    public pieChartDatasets = [ {
        data: [ 300, 500, 100, 2 ]
    } ];
    public pieChartLegend = true;
    public pieChartPlugins = [];

    isPreparing: number = 0;
    isEnding: number = 0;
    isPending: number = 0;
    isOrdering: number = 0
    payloadData: any;
    filteredData: any;
    columsData: ColumHeader[] = [];
    loading: boolean = true;
    themeSelected: string = ''
    statusFilter: Filters[];
    showHardReloadBtn: boolean = false;
    randomNumber: number = generateRandomNumber(1, 5);


    @ViewChild('qrCode', {static : false}) qrCode:any;

    AngularxQrCode: string = '';
    elem: any;
    itemSelected: any;
    clonedProfile: { [s: string]: any } = {};
    mediaSubscription: Subscription;
    Media: MediaResponse;

    constructor(private _mediaService: MediaService, private _clipboardService: ClipboardService, private _apiService: ApiService, private _notificationService: NotificationService, private _themeService: ThemeService, private _translateService: TranslateService) {
        this.themeSelected = this._themeService.getThemeSelected();
        this.statusFilter = StatusFilter;

        this.mediaSubscription = this._mediaService.subscribeMedia().subscribe(media => {
            this.Media = media;
        });
    }

    ngOnInit() {
        this.columsData = [
            { field: 'id', header: 'Id', title: 'Id' },
            { field: 'link', header: 'Link', title: 'Link' },
            { field: 'link', header: 'Code', title: 'Code' },
            { field: 'code', header: 'QR Code', title: 'QR Code' },
            { field: 'dateUpdated', header: 'Date Updated', title: 'Date Updated'},
            { field: 'status', header: 'Status', title: 'Status' },
            { field: 'action', header: 'Action', title: 'Action' },
        ]
        this.getAllCodes();
    }

    getAllCodes() {
        const URL = `${environment.WebApiUrl + GetMethods.ADMIN_GET_CODES }`;
        this.isPreparing = 0;
        this.isEnding = 0;
        this.isPending = 0;
        this.isOrdering = 0
        this._apiService.apiGetMethod(URL).subscribe({
          next: (result: ResponseData) => {
            if(result.success){
                this.payloadData = result.payload;
                this.payloadData.forEach(element => {
                    if (element.stateActivation == 'Preparando') {
                        this.isPreparing++;
                    }
                    if (element.stateActivation == 'Terminado') {
                        this.isEnding++;
                    }
                    if (element.stateActivation == 'Pendiente') {
                        this.isPending++;
                    }
                    if (element.stateActivation == 'Ordenando') {
                        this.isOrdering++;
                    }
                });
                this.pieChartDatasets = [ {
                    data: [ this.isPreparing, this.isEnding , this.isPending , this.isOrdering ]
                } ];
                this.filteredData = this.payloadData;
            }else {
                this._notificationService.error('An error occurred in the process.', 'bg-dark', 'animate__backInUp', 6000);
            }

            this.loading = false;
            
          },
          error: (err: any) => {
            console.log(err);
            this.loading = false;
            const messageTypeErrorText = responseError(err.status);
            this._notificationService.error(messageTypeErrorText, 'bg-dark', 'animate__backInUp', 6000);
          }
        });
    }

    refresh(){
        this.getAllCodes();
    }

    transformDate(date: any) {
        return transformDate(date)
    }

    onSetStatusFilter(value:any){
        console.log(value)
    }

    getStatusType(status:string){
        return getStatusType(status)
    }

    copy(text: string){
        this._clipboardService.copy(text);
        this._notificationService.success('Text copied..!', 'bg-success', 'animate__backInUp', 6000);
    }

    checkQrCode(item: any, link: any){
        this.itemSelected = item;
        this.AngularxQrCode = link;

        setTimeout(() => { this.elem =  this.qrCode.qrcElement.nativeElement.children[0]; 
            let context = this.elem.getContext("2d");
        
            // create image
            let img = new Image();
            img.crossOrigin="anonymous";
            // img.src = this.imgURL;
            img.src = 'https://res.cloudinary.com/ensamble/image/upload/v1619212083/mihxx1tmm5bgjiukmw7r.png'
        
            // fixed sizes
            let iWidth = 70;
            let iHeight = 70;
            
            let _that = this; 
            img.onload = () => {
                context.drawImage(img, (this.elem.width/2) - (iWidth/2),(this.elem.height/2) - (iHeight/2), iWidth, iHeight);
            }
        }, 100);

        var qrcodeModal = new bootstrap.Modal(document.getElementById('qrcodeModal'), {
            keyboard: false
        })
        qrcodeModal.show();
    }

    onRowEditInit(product: any) {
        this.clonedProfile[product.id as string] = { ...product };
    }

    onRowEditSave(product: any) {
        const URL = `${environment.WebApiUrl + PutMethods.ADMIN_UPDATE_QR_STATUS }`;
        this._apiService.apiPutMethod(URL, product).subscribe({
            next: (result: ResponseData) => {
                if(result.success){
                    delete this.clonedProfile[product.id as string];
                    this._notificationService.success(result.msg, 'bg-success', 'animate__backInUp', 6000);
                    this.getAllCodes();
                }else{
                    this._notificationService.warning(result.msg, 'bg-dark', 'animate__backInUp', 6000);
                }
            },
            error: (err: any) => {
                console.log(err);
                this._notificationService.warning('An error occurred in the process.', 'bg-dark', 'animate__backInUp', 6000);
            }
        });
    }

    onRowEditCancel(product: any, index: number) {
        this.payloadData[index] = this.clonedProfile[product.id as string];
        delete this.clonedProfile[product.id as string];
    }

    deleteQRCode(item){
        Swal.fire({
            text: this.TranslateText('Are you sure?'),
            icon: 'warning',
            showCancelButton: true,
            cancelButtonText: this.TranslateText('No'),
            confirmButtonText: this.TranslateText('Yes'),
            allowOutsideClick: false
        }).then((result) => {
            if (result.isConfirmed) {
                const URL = `${environment.WebApiUrl + DeleteMethods.ADMIN_DELETE_USER_BY_ID + '?id=' + item.id}`;
                this._apiService.apiDeleteMethod(URL, []).subscribe({
                    next: (result: ResponseData) => {
                        if(result.success){
                            this.getAllCodes();
                            this._notificationService.success(result.msg, 'bg-success', 'animate__backInUp', 6000);
                        }else{
                            this._notificationService.warning(result.msg, 'bg-dark', 'animate__backInUp', 6000);
                        }
                    },
                    error: (err: any) => {
                        console.log(err);
                        this._notificationService.warning('An error occurred in the process.', 'bg-dark', 'animate__backInUp', 6000);
                    }
                });
            }
        })
    }

    downloadImage(showimg: boolean){
        // get canvas dom element
        setTimeout(() => { this.elem =  this.qrCode.qrcElement.nativeElement.children[0]; 
          let context = this.elem.getContext("2d");
    
          // create image
          let img = new Image();
          img.crossOrigin="anonymous";
          // img.src = this.imgURL;
          img.src = 'https://res.cloudinary.com/ensamble/image/upload/v1619212083/mihxx1tmm5bgjiukmw7r.png'
    
          // fixed sizes
          let iWidth = 70;
          let iHeight = 70;
          
          let _that = this; 
          img.onload = () => {
            context.drawImage(img, (this.elem.width/2) - (iWidth/2),(this.elem.height/2) - (iHeight/2), iWidth, iHeight);   
            const fileName = this.itemSelected.petName + '.png' 
            saveAs(_that.canvasToBlob(this.elem), fileName);
          }
        }, 100);
        // convert to canvas type
    }

    canvasToBlob(canvas){
        let dataurl = canvas.toDataURL("image/png");
        let byteString = window.atob(dataurl.replace(/^data:image\/(png|jpg);base64,/, ""));
        const arrayBuffer = new ArrayBuffer(byteString.length);
        const int8Array = new Uint8Array(arrayBuffer);
        for (let i = 0; i < byteString.length; i++) {
          int8Array[i] = byteString.charCodeAt(i);
        }
        return new Blob([int8Array], { type: 'image/jpeg' });
    }
    
    TranslateText(text: string) {
        return this._translateService.instant(text);
    } 

    translateLabels(labels: string[]): string[] {
        return labels.map((label) => this._translateService.instant(label));
    }

    hardRefresh(){
        location.reload();
    }

    generateNewCode(){
        const URL = `${environment.WebApiUrl + PostMethods.ADMIN_POST_CREATE_NEW_QR_CODE}`;
        const data = {
            isActivated: true,
            stateActivation: 'Ordenando',
            randomCode: generateCodeRandom(6),
            hostname: window.location.hostname
        }
        this._apiService.apiPostMethod(URL, data).subscribe({
            next: (result: ResponseData) => {
                if(result.success){
                    this.getAllCodes();
                    this._notificationService.success(result.msg, 'bg-success', 'animate__backInUp', 6000);
                }else{
                    this._notificationService.warning(result.msg, 'bg-dark', 'animate__backInUp', 6000);
                }
            },
            error: (err: any) => {
                console.log(err);
                this._notificationService.warning('An error occurred in the process.', 'bg-dark', 'animate__backInUp', 6000);
            }
        });
    }

}
