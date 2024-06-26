import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ColumHeader, UserActivationTypeList, UserTypeList } from '@methods/constants';
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
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MediaResponse, MediaService } from '@services/media.service';
import { Subscription } from 'rxjs';

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

    mediaSubscription: Subscription;
    Media: MediaResponse;

    AngularxQrCode: string = '';
    elem: any;
    itemSelected: any;
    itemPetViewed: any;
    clonedProfile: { [s: string]: any } = {};
    clonedSecondProfile: { [s: string]: any } = {};
    themeSelected: string = '';
    userTypeFilter: Filters[];
    userTypeIdActivateFilter: Filters[];
    newPetRegisterByAdmin: any;

    userSelected: any = [];
    sidebarVisible: boolean = false;
    showFilterInputs: boolean = false;

    constructor(
        private _apiService: ApiService, 
        private _notificationService: NotificationService,
        private _translateService: TranslateService,
        private _clipboardService: ClipboardService,
        private _mediaService: MediaService, 
        private _themeService : ThemeService,
    ){
        this.AngularxQrCode = 'Initial QR code data string';
        this.themeSelected = this._themeService.getThemeSelected();
        this.userTypeFilter = UserTypeList;
        this.userTypeIdActivateFilter = UserActivationTypeList;

        this.mediaSubscription = this._mediaService.subscribeMedia().subscribe(media => {
            this.Media = media;
        });
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
        this.userSelected = item;
        this.sidebarVisible = true;
        
    }

    transformDate(date: any) {
        return transformDate(date)
    }

    dropImages(event: CdkDragDrop<string[]>) {
        moveItemInArray(this.userSelected.newPetProfile, event.previousIndex, event.currentIndex);
    }

    sortPetNameList(){
        const URL = `${environment.WebApiUrl + PutMethods.ADMIN_SORT_PET }`;
        this.userSelected._id = this.userSelected.id;
        this._apiService.apiPutMethod(URL, this.userSelected).subscribe({
            next: (result: ResponseData) => {
                if(result.success){ 
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

    deletePetByAdmin(item: any, idParental: any, idSecond: any){
        Swal.fire({
            text: this.TranslateText('Are you sure?'),
            icon: 'warning',
            showCancelButton: true,
            cancelButtonText: this.TranslateText('No'),
            confirmButtonText: this.TranslateText('Yes'),
            allowOutsideClick: false
        }).then((result) => {
            if (result.isConfirmed) {
                const URL = `${environment.WebApiUrl + PostMethods.ADMIN_DELETE_PET_BY_ID}`;
                const data = {
                    photo_id: item.photo_id,
                    idPrimary: idParental,
                    idSecond: idSecond
                }
                this._apiService.apiPostMethod(URL, data).subscribe({
                    next: (result: ResponseData) => {
                        if(result.success){
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

    onRowSecondEditInit(profile: any, petIndex: number) {
        // Clonar el objeto principal es decir el id con el clone
        this.clonedSecondProfile[profile.id as string]  = { ...profile.newPetProfile[petIndex]};
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

    editPetTest(userItem){
        console.log(userItem);
        const URL = `${environment.WebApiUrl + PutMethods.ADMIN_UPDATE_USER_FIRST_PROFILE }`;
        const data = { 
            address: userItem.address,
            age: userItem.age,
            birthDate: userItem.birthDate,
            country: userItem.country ? userItem.country : 'Costa Rica',
            email: userItem.email,
            favoriteActivities: userItem.favoriteActivities,
            genderSelected: userItem.genderSelected,
            healthAndRequirements: userItem.healthAndRequirements,
            isDigitalIdentificationActive: userItem.isDigitalIdentificationActive,
            lat: userItem.lat,
            lng: userItem.lng,
            ownerPetName: userItem.ownerPetName,
            permissions: [],
            petName: userItem.petName,
            petStatus: userItem.petStatus,
            petStatusReport: [],
            phone: userItem.phone,
            phoneVeterinarian: userItem.phoneVeterinarian,
            photo: userItem.photo,
            photo_id: userItem.photo_id,
            race: userItem.race, 
            userState: userItem.userState,
            veterinarianContact: userItem.veterinarianContact,
            weight: userItem.weight,
            id: userItem._id

            
        }

        console.log(data); 


        this._apiService.apiPutMethod(URL, data).subscribe({
            next: (result: ResponseData) => {
                if(result.success){
                    delete this.clonedProfile[userItem.id as string];
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

    onRowEditSaveSecondLevel(product: any) {
        const URL = `${environment.WebApiUrl + PutMethods.ADMIN_UPDATE_USER_PROFILE_SECOND_LEVEL }`;
        this._apiService.apiPutMethod(URL, product).subscribe({
            next: (result: ResponseData) => {
                if(result.success){
                    delete this.clonedSecondProfile[product._id  as string];

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

    onRowEditCancelSecond(product: any, index: number) {
        // product.newPetProfile[index] = this.clonedSecondProfile[product.newPetProfile[index]._id as string];
        delete this.clonedSecondProfile[product.newPetProfile[index]._id  as string];
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
        const codeUrl = `https://${window.location.hostname}/pet/${idParental}/${idSecond}`;
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

    openModalPetViewed(item: any){
        this.itemPetViewed = item;
        var modalPetViewed = new bootstrap.Modal(document.getElementById('modalPetViewed'), {
            keyboard: false
        })
        modalPetViewed.show();
    }

    openLocation(latitude: any, longitude: any){ 
        const googleMapsURL = `https://www.google.com/maps?q=${latitude},${longitude}`; 
        window.open(googleMapsURL, '_blank');
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

    addNewPet(item:any){
        this.itemSelected = []; 
        this.itemSelected = item;
        this.newPetRegisterByAdmin = new bootstrap.Modal(document.getElementById('newPetRegisterByAdmin'), {
            keyboard: false
        })
        this.newPetRegisterByAdmin.show()
    }

    cancel(){
        this.itemSelected = null; 
        this.newPetRegisterByAdmin.hide()
    }

    getProfileUpdated(idFormType: any){
        this.itemSelected = [];
        if(idFormType == 2) {
            this.newPetRegisterByAdmin.hide();
        }
        this.refreshData.emit(true);
    }
}
