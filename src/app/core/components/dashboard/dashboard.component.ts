import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { GetMethods, responseError, transformDate } from '@methods/methods';
import { User } from '@models/auth-model';
import { ResponseData } from '@models/models';
import { ApiService } from '@services/api.service';
import { MediaResponse, MediaService } from '@services/media.service';
import { NotificationService } from '@services/notification.service';
import { ClipboardService } from 'ngx-clipboard';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';

declare var bootstrap: any;

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html'
})

export class DashboardComponent implements OnInit {
    userLogin: User;
    payloadData: any;
    mediaSubscription: Subscription;
    Media: MediaResponse;
    editProfileModal: any;
    registerModal: any;
    itemPetSelected: any;
    profileForm: FormGroup;
    secondaryId: number = 0;
    formValidateInputs: any;
    formShowInputs: any;

    constructor(private _apiService: ApiService, 
        private _notificationService: NotificationService,
        private _mediaService: MediaService, 
        private _router: Router, 
        private _clipboardService: ClipboardService,
        private _formBuilder: FormBuilder) {
        this.mediaSubscription = this._mediaService.subscribeMedia().subscribe(media => {
            this.Media = media;
        });
    }

    ngOnInit() {
        this.userLogin = JSON.parse(localStorage.getItem('user')!);
        if (this.userLogin != null) {
            this.getUserProfile();
        }

        this.profileForm =  this._formBuilder.group({
            ownerPetName: [''],
            petName: [''],
            phone: [''],
            birthDate: [''],
            veterinarianContact: [''],
            phoneVeterinarian: [''],
            favoriteActivities: [''],
            healthAndRequirements: [''],
            address: ['']
        });

        this.formValidateInputs = [
            { control: 'genderSelected', show: true},
            { control: 'petName', show: true },
            { control: 'phone', show: true },
            { control: 'codeGenerator', show: false },
            { control: 'email', show: false },
            { control: 'password', show: false},
            { control: 'confirmPassword', show: false},
            { control: 'acceptTerms', show: false },
        ]

        this.formShowInputs = {
            showGenderSelected: true,
            showPetName: true,
            showPhone: true,
            showCodeGenerator: false,
            showEmail: false,
            showPassword: false,
            showConfirmPassword: false,
            showAcceptTerms: false
        }
    }

    getUserProfile() {
        const URL = `${environment.WebApiUrl + GetMethods.GET_USER_PROFILE_BY_ID + '?id=' + this.userLogin.id}`;
        this._apiService.apiGetMethod(URL).subscribe({
            next: (result: ResponseData) => {
                if (result.success) {
                    this.payloadData = result.payload;
                    console.log(this.payloadData);
                }
            },
            error: (err: any) => {
                console.log(err);
                const messageTypeErrorText = responseError(err.status);
                this._notificationService.error(messageTypeErrorText, 'bg-dark', 'animate__backInUp', 6000);
            }
        });
    }

    openExternalProfile(idPrimary: any, idSecondary: any) {
        const url = this._router.createUrlTree(['/myPetCode/'],{ queryParams: { id: idPrimary, idSecond: idSecondary }})
        window.open(url.toString(), '_blank')
    }

    copy(primaryId: any, secondaryId: any){
        var text: string = 'https://www.localpetsandfamily.com/myPetCode?id=' + primaryId +'&idSecond='+ secondaryId;
        this._clipboardService.copy(text);
        this._notificationService.success('Text copied..!', 'bg-success', 'animate__backInUp', 6000);
    }

    transformDate(date: any) {
        return transformDate(date);
    }

    editProfile(item: any, secondaryId: any){
        this.itemPetSelected = item;
        this.secondaryId = secondaryId;

        this.profileForm.get('ownerPetName')?.setValue(this.itemPetSelected.ownerPetName);
        this.profileForm.get('petName')?.setValue(this.itemPetSelected.petName);
        this.profileForm.get('phone')?.setValue(this.itemPetSelected.phone);
        this.profileForm.get('birthDate')?.setValue(this.itemPetSelected.birthDate != undefined ? new Date(this.itemPetSelected.birthDate): new Date());
        this.profileForm.get('veterinarianContact')?.setValue(this.itemPetSelected.veterinarianContact);
        this.profileForm.get('phoneVeterinarian')?.setValue(this.itemPetSelected.phoneVeterinarian);
        this.profileForm.get('favoriteActivities')?.setValue(this.itemPetSelected.favoriteActivities);
        this.profileForm.get('healthAndRequirements')?.setValue(this.itemPetSelected.healthAndRequirements);
        this.profileForm.get('address')?.setValue(this.itemPetSelected.address);

        this.editProfileModal = new bootstrap.Modal(document.getElementById('editProfileModal'), {
            keyboard: false
        })
        this.editProfileModal.show()
    }

    getProfileUpdated(itemUpdated: any){
        this.editProfileModal.hide()
        this.getUserProfile();
    }
    
    registerNewPet(){
        this.registerModal = new bootstrap.Modal(document.getElementById('registerModal'), {
            keyboard: false
        })
        this.registerModal.show()
    }

    cancel(){
        this.itemPetSelected = [];
    }
}
