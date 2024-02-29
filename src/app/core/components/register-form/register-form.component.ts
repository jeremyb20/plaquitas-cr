import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { COUNTRYFLAG, CountryFlag, getCountry } from '@methods/countrycode';
import { MustMatch, PostMethods } from '@methods/methods';
import { User } from '@models/auth-model';
import { ResponseData } from '@models/models';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from '@services/api.service';
import { MediaResponse, MediaService } from '@services/media.service';
import { NotificationService } from '@services/notification.service';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
declare const bootstrap: any;

@Component({
    selector: 'app-register-form',
    templateUrl: './register-form.component.html'
})
export class RegisterFormComponent implements OnInit {
    mediaSubscription: Subscription;
    Media: MediaResponse;
    country: any;
    countryCode: any;
    countryFlag: any = CountryFlag;

    @Input() primaryId: any;
    @Input() secondaryId: any;
    @Input() isNewPetRegisterFromUserProfile: boolean;
    @Input() formValidation: any;
    @Input() formShowInputs: any;
    @Input() registerType: number;
    @Input() payloadData: any;
    @Output() refreshUserData = new EventEmitter<any>();

    showPassword: boolean = false;
    showPassword2: boolean = false;
    loading: boolean = false;
    submitted: boolean = false;
    registerForm: FormGroup;

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

    constructor(
        private formBuilder: FormBuilder,
        private _apiService: ApiService,
        private _translateService: TranslateService,
        private _notificationService: NotificationService,
        private router: Router,
        private route: ActivatedRoute, 
        private _mediaService: MediaService) {

        this.mediaSubscription = this._mediaService.subscribeMedia().subscribe(media => {
            this.Media = media;
        });
    }

    ngOnInit() {
        this.userLogin = JSON.parse(localStorage.getItem('user')!);
        this.genderType = [
            { Id: 1, gender: 'Macho' },
            { Id: 2, gender: 'Hembra' }
        ];
        this.country = getCountry(); 
        this.countryCode = CountryFlag.find(element => this.country == element.name);

        this.registerForm = this.formBuilder.group({
            petName: ['', Validators.required],
            genderSelected: ['', Validators.required],
            country: [this.countryCode.name],
            phone: new FormControl('', [Validators.required, Validators.minLength(6), Validators.pattern(/\d/)]),
            email: ['', [Validators.required, Validators.email]],
            password: new FormControl('', [Validators.required, Validators.minLength(6)]),
            confirmPassword: new FormControl('', [Validators.required, Validators.minLength(6)]),
            codeGenerator: ['', Validators.required],
            acceptTerms: [false, Validators.requiredTrue]
        }, {
            validator: MustMatch('password', 'confirmPassword')
        });


        Object.keys(this.registerForm.controls).forEach(key => {
            this.formValidation.forEach(element => {
                if(element.control == key){
                    if(!element.show){
                        var inputName = this.registerForm.get(key);
                        inputName?.setValidators(null);
                        inputName?.updateValueAndValidity();
                    }
                }
            });
        });
    }
    
    get f() { return this.registerForm.controls; }

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
        this.registerForm.get('country')?.setValue(country.value);
    }

    onSubmit() {
        this.submitted = true;
        // stop here if form is invalid
        if (this.registerForm.invalid) {
            return;
        }
        if (this.file != undefined) {
            this.loading = true;
            const URL = `${ environment.WebApiUrl + this.returnURLParameter(this.registerType) }`;
            const data: any = this.returnObjectData(this.registerType);

            const fd = new FormData();
            fd.append('petName', data.petName);
            fd.append('phone', data.phone);
            fd.append('userState', data.userState);
            fd.append('email', data.email.toLowerCase());
            fd.append('password', data.password);
            fd.append('country', data.country);
            fd.append('image', data.photo);
            fd.append('petStatus', data.petStatus);
            fd.append('genderSelected', data.genderSelected);
            fd.append('isActivated', data.isActivated);
            fd.append('ownerPetName', data.ownerPetName != undefined ? data.ownerPetName: '');
            fd.append('birthDate', data.birthDate != undefined ? data.birthDate : new Date());
            fd.append('favoriteActivities', data.favoriteActivities != undefined ? data.favoriteActivities : '');
            fd.append('healthAndRequirements', data.healthAndRequirements != undefined ? data.healthAndRequirements : '');
            fd.append('phoneVeterinarian', data.phoneVeterinarian != undefined? data.phoneVeterinarian : '');
            fd.append('veterinarianContact', data.veterinarianContact != undefined ? data.veterinarianContact : '');
            fd.append('address', data.address != undefined ? data.address : '');
            fd.append('codeGenerator', data.codeGenerator);
            fd.append('_id', data._id);

            this._apiService.apiPostMethod(URL, fd).subscribe({
                next: (result: ResponseData) => {
                    if (result.success) {
                        this.loading = false;
                        this.photoSelected = null;
                        this.uploadedFiles = [];
                        if(this.registerType == 1) {
                            this.registerForm.reset();
                            this.refreshUserData.emit(true);
                            this._notificationService.success(result.msg, 'bg-success', 'animate__backInUp', 6000);

                        }else{
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
                                    if(this.registerType == 0 || this.registerType == 2){
                                        this.router.navigate(['/login']);
                                    }
                                }
                            });
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
        } else {
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
        }
    }

    returnURLParameter(key: number) {
        switch (key) {
            case 0 : return PostMethods.USER_REGISTER_NEW_PET;
            case 1 : return PostMethods.USER_REGISTER_NEW_PET_FROM_USER_PROFILE;
            case 2 : return PostMethods.USER_REGISTER_NEW_PET_FOR_QR_CODE;
            default: return null;
        }
    }

    returnObjectData(key: number) {
        switch (key) {

            // registro normail
            case 0 : return {
                petName: this.f.petName.value,
                phone: this.f.phone.value,
                email: this.f.email.value.toLowerCase(),
                password: this.f.password.value,
                acceptTerms: this.f.acceptTerms.value,
                genderSelected: this.f.genderSelected.value,
                country: this.f.country.value,
                userState: 3,
                petStatus: 'No-Perdido',
                isActivated: false,
                address: '',
                birthDate: new Date(),
                favoriteActivities: '',
                healthAndRequirements: '',
                phoneVeterinarian: '',
                veterinarianContact: '',
                photo: this.file
            }

            //registro de nueva mascota en el perfil de usuario ya creado

            case 1 : return {
                genderSelected: this.f.genderSelected.value,
                petName: this.f.petName.value,
                phone: this.f.phone.value,
                email: this.userLogin.email.toLowerCase(),
                userState: 3,
                petStatus: 'No-Perdido',
                isActivated: false,
                country: this.f.country.value,
                photo: this.file,
                _id: this.payloadData._id,
                ownerPetName: this.payloadData.ownerPetName,
                address: this.payloadData.address,
                birthDate: new Date(),
                favoriteActivities: '',
                healthAndRequirements: '',
                phoneVeterinarian: '',
                veterinarianContact: ''
            }

            // desde un qr code
            case 2: return {
                _id: this.primaryId,
                idSecond: this.secondaryId,
                codeGenerator: this.f.codeGenerator.value,
                petName: this.f.petName.value,
                phone: this.f.phone.value,
                email: this.f.email.value.toLowerCase(),
                password: this.f.password.value,
                acceptTerms: this.f.acceptTerms.value,
                genderSelected: this.f.genderSelected.value,
                country: this.f.country.value,
                birthDate: new Date(),
                userState: 3,
                petStatus: 'No-Perdido',
                isActivated: false,
                photo: this.file
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
        this.registerForm.reset();
    }
}