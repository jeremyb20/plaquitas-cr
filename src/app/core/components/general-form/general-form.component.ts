import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { COUNTRYFLAG, CountryFlag, getCountry } from '@methods/countrycode';
import { MustMatch, PostMethods, PutMethods, buildFormData, formShowFields, formValidateInput } from '@methods/methods';
import { User } from '@models/auth-model';
import { ResponseData } from '@models/models';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from '@services/api.service';
import { MediaResponse, MediaService } from '@services/media.service';
import { NotificationService } from '@services/notification.service';
import { Subscription, mergeMap, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
declare const bootstrap: any;

@Component({
  selector: 'app-general-form',
  templateUrl: './general-form.component.html', 
})
export class GeneralFormComponent implements OnInit { 
    @Input() formIdType: number; 
    @Input() isEditProfile: boolean;

    @Input() primaryId: any;
    @Input() secondaryId: any;

    @Input() itemSelected: any;
    @Output() refreshUserData = new EventEmitter<any>(); 

    formValidateInputFields: any;
    formShowFields : any;

    mediaSubscription: Subscription;
    Media: MediaResponse;
    country: any;
    countryCode: any;
    countryFlag: any = CountryFlag;

    generalForm: FormGroup

    showPassword: boolean = false;
    showPassword2: boolean = false;
    loading: boolean = false;
    submitted: boolean = false; 

    hideMsg: boolean = false;
    isActivated: boolean;
    ShowMsg: string;
    timeSeconds: number = 6000;
    maxSizeInBytes = 6 * 1024 * 1024; // 5MB
    file: File;
    photoSelected: any | ArrayBuffer;
    uploadedFiles: any[] = [];
    genderType: any = [];
    userLogin: User;

    date: any = new Date();

    constructor(
        private formBuilder: FormBuilder,
        private _apiService: ApiService,
        private _translateService: TranslateService,
        private _notificationService: NotificationService,
        private router: Router, 
        private _mediaService: MediaService) {

        this.mediaSubscription = this._mediaService.subscribeMedia().subscribe(media => {
            this.Media = media;
        });
    }

    ngOnInit() {
        this.userLogin = JSON.parse(localStorage.getItem('user')!);

        this.formValidateInputFields = formValidateInput(this.formIdType);
        this.formShowFields = formShowFields(this.formIdType)

        this.genderType = [
            { Id: '1', gender: 'Macho' },
            { Id: '2', gender: 'Hembra' }
        ];

        this.country = getCountry(); 
        this.countryCode = CountryFlag.find(element => this.country == element.name);
 

        this.generalForm = this.formBuilder.group({
    
            phone: new FormControl( this.isEditProfile ? this.itemSelected.phone : '', [Validators.required, Validators.minLength(6), Validators.pattern(/\d/)]),
            email: [ this.isEditProfile ? this.itemSelected.email : '', [Validators.required, Validators.email]],
            password: new FormControl( '', [Validators.required, Validators.minLength(6)]),
            confirmPassword: new FormControl( '', [Validators.required, Validators.minLength(6)]),
            codeGenerator: [ '', Validators.required],
            acceptTerms: [false, Validators.requiredTrue],

            ownerPetName : [ this.isEditProfile ? this.itemSelected.ownerPetName : '', [Validators.required]],
            petName: [ this.isEditProfile ? this.itemSelected.petName : '', [Validators.required]], 
            genderSelected: [ this.isEditProfile ? this.itemSelected.genderSelected : '', [Validators.required]],
            race: [ this.isEditProfile ? this.itemSelected.race : '', [Validators.required]],
            weight: [ this.isEditProfile ? this.itemSelected.weight : '', [Validators.required]],
            birthDate: [ this.isEditProfile ? new Date(this.itemSelected.birthDate) : '', [Validators.required]],
            veterinarianContact: [ this.isEditProfile ? this.itemSelected.veterinarianContact : '', [Validators.required]],
            phoneVeterinarian: [ this.isEditProfile ? this.itemSelected.phoneVeterinarian : '', [Validators.required]],
            favoriteActivities: [ this.isEditProfile ? this.itemSelected.favoriteActivities : '', [Validators.required]],
            healthAndRequirements: [ this.isEditProfile ? this.itemSelected.healthAndRequirements : '', [Validators.required]],
            address: [ this.isEditProfile ? this.itemSelected.address : '', [Validators.required]],
            country: [ this.isEditProfile ? this.itemSelected.country : this.countryCode.name],
        }, {
            validator: MustMatch('password', 'confirmPassword')
        });

        Object.keys(this.generalForm.controls).forEach(key => {
            this.formValidateInputFields.forEach(element => {
                if(element.control == key){
                    if(!element.isRequired){
                        var inputName = this.generalForm.get(key);
                        inputName?.setValidators(null);
                        inputName?.updateValueAndValidity();
                    }
                }
            });
        });
    }
    
    get f() { return this.generalForm.controls; }

    processFile(event: any): void {
        for (let file of event.currentFiles) {
            this.uploadedFiles = file;
            if (this.uploadedFiles) {
                this.file = <File>event.files[0];
                if (this.file.type == String('image/png') || this.file.type == String('image/jpg') || this.file.type == String('image/jpeg')) {
                    const reader = new FileReader();
                    reader.onload = e => this.photoSelected = reader.result;
                    reader.readAsDataURL(this.file);
                } else {
                    Swal.fire({
                        position: 'center',
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Solo se permite formatos JPG, PNG, JPEG',
                        confirmButtonText: 'OK',
                    })
                }
            }
        }
    }

    onChangeCountry(country:any){  
        this.generalForm.get('country')?.setValue(country.value);
    }

    onSubmit() {
        this.submitted = true; 
        if (this.generalForm.invalid) {
            return;
        }

        if(this.formShowFields.showFileImg){
            if(!this.file){
                Swal.fire({
                    title: 'Campo requerido',
                    html: "Favor de ingresar una foto para " + this.f.petName.value,
                    showCancelButton: false,
                    allowEscapeKey: false,
                    confirmButtonText: 'OK',
                    allowOutsideClick: false,
                    buttonsStyling: false,
                    reverseButtons: true,
                    position: 'top',
                    padding: 0,
                    customClass: { confirmButton: 'col-auto btn btn-info m-3' }
                }).then((result) => { });
                return
            }
        } 
        this.loading = true;
        const URL = `${ environment.WebApiUrl + this.returnURLParameter(this.formIdType) }`;
        const data: any = this.returnObjectData(this.formIdType);

        const fd = buildFormData(data);  

        const apiMethod = this.formIdType === 3 ? this._apiService.apiPutMethod : this._apiService.apiPostMethod;

        const apiCall$ = of(null).pipe(
            mergeMap(() => apiMethod.call(this._apiService, URL, fd))
        );

        apiCall$.subscribe({
            next: (result: ResponseData) => {
                if (result.success) {
                    this.loading = false;
                    this.photoSelected = null;
                    this.uploadedFiles = [];
                    if(this.formIdType == 0 || this.formIdType == 1 ) {
            
                        Swal.fire({
                            position: 'center',
                            icon: 'success',
                            title: 'Se ha registrado ' + this.f.petName.value + ' exitosamente!',
                            html: this.TranslateText(result.msg),
                            allowOutsideClick: false,
                            confirmButtonText: 'OK',
                        })
                        .then((result) => {
                            if (result.value) {
                                this.router.navigate(['/login']);
                            }
                        });

                    }else{ 
                        this.refreshUserData.emit(this.formIdType);
                        this._notificationService.success(result.msg, 'bg-success', 'animate__backInUp', 6000);
                    }
                } else {
                    console.log(result)
                    this.hideMsg = true;
                    this.loading = false;
                    this.ShowMsg = this.TranslateText(result.msg);
                    setTimeout(() => { this.hideMsg = false }, this.timeSeconds);
                }
            },
            error: (err: any) => {
                console.log(err);
                this.hideMsg = true;
                this.loading = false;
                this.ShowMsg = "Ocurrio un error favor contactar a soporte o al administrador del sitio";
                setTimeout(() => { this.hideMsg = false }, this.timeSeconds);
            }
        });
    }


    returnURLParameter(key: number) {
        switch (key) {
            case 0 : return PostMethods.USER_REGISTER_NEW_PET;
            case 1 : return PostMethods.USER_REGISTER_NEW_PET_FOR_QR_CODE;
            case 2 : return PostMethods.USER_REGISTER_NEW_PET_FROM_USER_PROFILE;
            case 3 : return PutMethods.USER_UPDATE_PET_PROFILE;
            default: return null;
        }
    }

    returnObjectData(key: number) {
        switch (key) {

            // Registro de usuario sin codigo 
            case 0 : return { 
                phone: this.f.phone.value,
                country: this.f.country.value,
                email: this.f.email.value.toLowerCase(),
                password: this.f.password.value,
                acceptTerms: this.f.acceptTerms.value, 
                userState: 3, 
                isActivated: false,   
            }

            // Registro de un usuario con codigo
            case 1: return {
                _id: this.primaryId,
                idSecond: this.secondaryId,
                codeGenerator: this.f.codeGenerator.value, 
                phone: this.f.phone.value,
                email: this.f.email.value.toLowerCase(),
                password: this.f.password.value,
                acceptTerms: this.f.acceptTerms.value, 
                country: this.f.country.value, 
                userState: 3, 
                isActivated: false
            }

            //Registro de una mascota dentro de la aplicacion // en dashboard

            case 2 : return {
                _id: this.primaryId,
                ownerPetName: this.f.ownerPetName.value,
                genderSelected: this.f.genderSelected.value.toString(),
                petName: this.f.petName.value,
                race: this.f.race.value,
                weight: this.f.weight.value,
                phone: this.f.phone.value,
                country: this.f.country.value, 
                birthDate: this.f.birthDate.value,
                veterinarianContact: this.f.veterinarianContact.value,
                phoneVeterinarian: this.f.phoneVeterinarian.value,
                favoriteActivities: this.f.favoriteActivities.value,
                healthAndRequirements: this.f.healthAndRequirements.value,
                address: this.f.address.value,
                image: this.file,
            }

            // Editar mascota en Dashboard
            case 3 : return {
                _id: this.primaryId,
                secondaryId: this.secondaryId,
                ownerPetName: this.f.ownerPetName.value,
                genderSelected: this.f.genderSelected.value.toString(),
                petName: this.f.petName.value,
                race: this.f.race.value,
                weight: this.f.weight.value,
                phone: this.f.phone.value,
                country: this.f.country.value, 
                birthDate: this.f.birthDate.value,
                veterinarianContact: this.f.veterinarianContact.value,
                phoneVeterinarian: this.f.phoneVeterinarian.value,
                favoriteActivities: this.f.favoriteActivities.value,
                healthAndRequirements: this.f.healthAndRequirements.value,
                address: this.f.address.value
            }

            default: return null;
        }
    }

    TranslateText(text: string) {
        return this._translateService.instant(text);
    }

    openTermsAndCondiions() {
        var openTermsAndCondiions = new bootstrap.Modal(document.getElementById('termsandcondition'), {
            keyboard: false
        })
        openTermsAndCondiions.show()
    }

    onReset() {
        this.submitted = false;
        this.generalForm.reset();
    }
}