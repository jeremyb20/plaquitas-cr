import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ColumHeader, UserTypeList } from '@methods/constants';
import { DeleteMethods, DeleteUserById, PostMethods, PutMethods, getStatusType, transformDate } from '@methods/methods';
import { Filters, ResponseData } from '@models/models';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from '@services/api.service';
import { NotificationService } from '@services/notification.service';
import { environment } from 'src/environments/environment';
import { ClipboardService } from 'ngx-clipboard';
import { saveAs } from 'file-saver-es';
import Swal from 'sweetalert2';
import { ThemeService } from '@services/theme.service';

declare const bootstrap: any;

@Component({
    selector: 'app-generic-data-table',
    templateUrl: './generic-data-table.component.html'
})
export class GenericDataTableComponent {
    @Input() payloadData: any;
    @Input() columsData: ColumHeader[];
    @Input() loading: boolean;
    @Input() showHardReloadBtn: boolean;
    @Output() refreshData = new EventEmitter<any>();

    @ViewChild('qrCode', {static : false}) qrCode:any;

    AngularxQrCode: string = '';
    elem: any;
    itemSelected: any;
    clonedProfile: { [s: string]: any } = {};
    themeSelected: string = '';
    userTypeFilter: Filters[];

    constructor(
        private _apiService: ApiService, 
        private _notificationService: NotificationService,
        private _translateService: TranslateService,
        private _clipboardService: ClipboardService,
        private _themeService : ThemeService,
    ){
        this.AngularxQrCode = 'Initial QR code data string';
        this.themeSelected = this._themeService.getThemeSelected();
        this.userTypeFilter = UserTypeList
    }

    getStatusType(status: string) {
        return getStatusType(status)
    }

    hardRefresh(){
        location.reload();
    }

    refresh(){
        this.refreshData.emit(true);
    }

    editUser(item:any){
        console.log(item);
    }

    transformDate(date: any) {
        return transformDate(date)
    }

    deleteUser(user: any){
        Swal.fire({
            text: this.TranslateText('Are you sure?'),
            icon: 'warning',
            showCancelButton: true,
            cancelButtonText: this.TranslateText('No'),
            confirmButtonText: this.TranslateText('Yes'),
            allowOutsideClick: false
        }).then((result) => {
            if (result.isConfirmed) {
                const URL = `${environment.WebApiUrl + DeleteMethods.ADMIN_DELETE_USER_BY_ID + '?id=' + user.id}`;
                this._apiService.apiDeleteMethod(URL, []).subscribe({
                    next: (result: ResponseData) => {
                        if(result.success){
                            // DeleteUserById(this.payloadData, user.id);
                            this.refresh();
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

    onRowEditInit(product: any) {
        this.clonedProfile[product.id as string] = { ...product };
    }

    onRowEditSave(product: any) {
        const URL = `${environment.WebApiUrl + PutMethods.ADMIN_UPDATE_USER_PROFILE }`;
        this._apiService.apiPutMethod(URL, product).subscribe({
            next: (result: ResponseData) => {
                if(result.success){
                    delete this.clonedProfile[product.id as string];
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

    onRowEditCancel(product: any, index: number) {
        this.payloadData[index] = this.clonedProfile[product.id as string];
        delete this.clonedProfile[product.id as string];
    }

    TranslateText(text: string) {
        return this._translateService.instant(text);
    } 

    downloadModal() {
        var downloadModal = new bootstrap.Modal(document.getElementById('downloadAs'), {
            keyboard: false
        })
        if (this.payloadData.length != 0)
            downloadModal.show()
    }

    checkQrCode(item: any, idParental: any, idSecond: any){
        this.itemSelected = item;
        const codeUrl = `https://www.localpetsandfamily.com/myPetCode/${idParental}/${idSecond}`;
        this.AngularxQrCode = codeUrl;

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

    copy(text: string){
        this._clipboardService.copy(text);
        this._notificationService.success('Text copied..!', 'bg-success', 'animate__backInUp', 6000);
    }
}
