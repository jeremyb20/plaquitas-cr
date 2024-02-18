import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GetMethods, PutMethods, calcularEdadPerro, calcularEdadPerroDesdeHumano, calculateAge, responseError, transformDate } from '@methods/methods';
import { User } from '@models/auth-model';
import { ResponseData } from '@models/models';
import { ApiService } from '@services/api.service';
import { MediaResponse, MediaService } from '@services/media.service';
import { NotificationService } from '@services/notification.service';
import { ClipboardService } from 'ngx-clipboard';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {
    private mediaSubscription: Subscription;
    @Input() showEditBtnEvent: boolean;
    @Input() isPublicProfile: boolean;
    @Input() payloadData: any;
    @Input() primaryId: any;
    @Input() secondaryId: any;

    userLogin: User;
    Media: MediaResponse;
    submitted: boolean = false;
    profileForm: FormGroup;
    isProfileEdition: boolean = false;
    loading: boolean = false;
    humanAge: number = 0;

    constructor(private _router: Router, private _media: MediaService, private _apiService: ApiService, private _clipboardService: ClipboardService, private _notificationService: NotificationService, private _formBuilder: FormBuilder) {
        this.mediaSubscription = this._media.subscribeMedia().subscribe(media => {
            this.Media = media;
        });
    }

    get f() { return this.profileForm.controls; }


    ngOnInit() {
        this.userLogin = JSON.parse(localStorage.getItem('user')!);

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

        if (this.userLogin != null) {
            if(!this.payloadData){
                this.getUserProfileById();  
            }

            if(this.primaryId == undefined){
                this.showEditBtnEvent = true;
            }
            //this.getUserProfileById();
        }
    }

    getUserProfileById() {
        const URL = `${environment.WebApiUrl + GetMethods.GET_USER_PROFILE_BY_ID + '?id=' + this.userLogin.id}`;
        this._apiService.apiGetMethod(URL).subscribe({
            next: (result: ResponseData) => {
                if(result.success){
                    this.payloadData = result.payload;
                }
            },
            error: (err: any) => {
                console.log(err);
                const messageTypeErrorText = responseError(err.status);
                this._notificationService.error(messageTypeErrorText, 'bg-dark', 'animate__backInUp', 6000);
            }
        });
    }

    editProfile(profile: any ){
        this.isProfileEdition = !this.isProfileEdition;
        this.profileForm.get('ownerPetName')?.setValue(profile.ownerPetName);
        this.profileForm.get('petName')?.setValue(profile.petName);
        this.profileForm.get('phone')?.setValue(profile.phone);
        this.profileForm.get('birthDate')?.setValue(profile.birthDate != undefined ? new Date(profile.birthDate): new Date());
        this.profileForm.get('veterinarianContact')?.setValue(profile.veterinarianContact);
        this.profileForm.get('phoneVeterinarian')?.setValue(profile.phoneVeterinarian);
        this.profileForm.get('favoriteActivities')?.setValue(profile.favoriteActivities);
        this.profileForm.get('healthAndRequirements')?.setValue(profile.healthAndRequirements);
        this.profileForm.get('address')?.setValue(profile.address);
    }

    onSubmit(){
        const data = {
            ownerPetName: this.f.ownerPetName.value,
            petName: this.f.petName.value,
            phone: this.f.phone.value,
            birthDate: this.f.birthDate.value,
            veterinarianContact: this.f.veterinarianContact.value,
            phoneVeterinarian: this.f.phoneVeterinarian.value,
            favoriteActivities: this.f.favoriteActivities.value,
            healthAndRequirements: this.f.healthAndRequirements.value,
            address: this.f.address.value,
            _id: this.userLogin.id
        }
        const URL = `${environment.WebApiUrl + PutMethods.USER_UPDATE_PROFILE }`;
        this._apiService.apiPutMethod(URL, data).subscribe({
            next: (result: ResponseData) => {
                if(result.success){
                    this.isProfileEdition = false;
                    this.getUserProfileById();
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

    goToProfile() {
        this._router.navigate(['/myPetCode/'],{ queryParams: { id: this.userLogin.id, idSecond: 0 }}); 
    }

    transformDate(date: any) {
        return transformDate(date);
    }

    calculateAge(date){
        this.humanAge = calculateAge(date);
        return this.humanAge;
    }

    calculatePetAge(date){
        return calcularEdadPerro(date);
    }

    calcularEdadPerroDesdeHumano(){
        return calcularEdadPerroDesdeHumano(this.humanAge)
    }

    openExternalProfile(idPrimary: any, idSecondary: any) {
        const url = this._router.createUrlTree(['/myPetCode/'],{ queryParams: { id: idPrimary, idSecond: idSecondary }})
        window.open(url.toString(), '_blank')
    }

    copy(){
        var text: string = '';
        if(this.primaryId != undefined){
            text = 'https://' + window.location.hostname + '/myPetCode?id=' + this.primaryId +'&idSecond='+ this.secondaryId;
        }else{
            text = 'https://' + window.location.hostname + '/myPetCode?id=' + this.userLogin.id +'&idSecond='+ 0;
        }
        this._clipboardService.copy(text);
        this._notificationService.success('Text copied..!', 'bg-success', 'animate__backInUp', 6000);
    }

    newPetModal(){

    }
}
