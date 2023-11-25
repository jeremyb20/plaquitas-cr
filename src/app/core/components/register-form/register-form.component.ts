import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MustMatch, PostMethods } from '@methods/methods';
import { ResponseData } from '@models/models';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from '@services/api.service';
import { MediaResponse, MediaService } from '@services/media.service';
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

    @Input() primaryId: any;
    @Input() secondaryId: any;
    @Input() isNewPetRegisterFromUserProfile: boolean;
    @Input() formValidation: any;
    @Input() formShowInputs: any;

    showPassword: boolean = false;
    showPassword2: boolean = false;
    loading: boolean = false;
    submitted: boolean = false;
    registerForm: FormGroup;

    hideMsg: boolean = false;
    getLinkIdParam: null;
    getLinkIdSecondaryParams: null;
    isActivated: boolean;
    ShowMsg: string;
    timeSeconds: number = 6000;
    file: File;
    photoSelected: any | ArrayBuffer;
    uploadedFiles: any[] = [];
    genderType: any = [];
    showInputCode: boolean = false;


    constructor(
        private formBuilder: FormBuilder,
        private _apiService: ApiService,
        private _translateService: TranslateService,
        private router: Router,
        private route: ActivatedRoute, private _mediaService: MediaService) {

        this.mediaSubscription = this._mediaService.subscribeMedia().subscribe(media => {
            this.Media = media;
        });

        if (this.getLinkIdParam == undefined) {
            this.route.queryParams.subscribe(params => {
                this.getLinkIdParam = params.id;
                this.getLinkIdSecondaryParams = params.idSecond;
                this.isActivated = Boolean(params.isActivated);
                this.showInputCode = (this.getLinkIdParam == undefined) ? false : true;
            });
        }
    }

    ngOnInit() {
        this.genderType = [
            { Id: 1, gender: 'Macho' },
            { Id: 2, gender: 'Hembra' }
        ];

        console.log(this.formValidation)

        this.registerForm = this.formBuilder.group({
            petName: ['', Validators.required],
            codeGenerator: ['', Validators.required],
            genderSelected: ['', Validators.required],
            phone: new FormControl('', [Validators.required, Validators.minLength(6), Validators.pattern(/\d/)]),
            email: ['', [Validators.required, Validators.email]],
            password: new FormControl('', [Validators.required, Validators.minLength(6)]),
            confirmPassword: new FormControl('', [Validators.required, Validators.minLength(6)]),
            acceptTerms: [false, Validators.requiredTrue]
        }, {
            validator: MustMatch('password', 'confirmPassword')
        });

        if (!this.showInputCode) {
            var inputName = this.registerForm.get('codeGenerator');
            inputName?.setValidators(null);
            inputName?.updateValueAndValidity();
        }


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

    onSubmit() {
        this.submitted = true;
        // stop here if form is invalid
        if (this.registerForm.invalid) {
            return;
        }
        if (this.file != undefined) {
            this.loading = true;
            const URL = `${environment.WebApiUrl + PostMethods.USER_REGISTER_NEW_PET }`;
            const data: any = this.returnObjectData(this.showInputCode);

            const fd = new FormData();
            fd.append('petName', data.petName);
            fd.append('phone', data.phone);
            fd.append('userState', data.userState);
            fd.append('email', data.email);
            fd.append('password', data.password);
            fd.append('image', data.photo);
            fd.append('petStatus', data.petStatus);
            fd.append('genderSelected', data.genderSelected);
            fd.append('isActivated', data.isActivated);

            this._apiService.apiPostMethod(URL, fd).subscribe({
                next: (data: ResponseData) => {
                    if (data.success) {
                        this.loading = false;
                        Swal.fire({
                            position: 'center',
                            icon: 'success',
                            title: 'Registro de ' + this.f.petName.value + ' exitoso',
                            html: this.TranslateText(data.msg),
                            confirmButtonText: 'OK',
                        })
                            .then((result) => {
                                if (result.value) {
                                    this.router.navigate(['/login']);
                                }
                            });
                    } else {
                        this.hideMsg = true;
                        this.loading = false;
                        this.ShowMsg = this.TranslateText(data.msg);
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

    returnObjectData(key: boolean) {
        switch (key) {
            case true: return {
                petName: this.f.petName.value,
                phone: this.f.phone.value,
                email: this.f.email.value.toLowerCase(),
                password: this.f.password.value,
                acceptTerms: this.f.acceptTerms.value,
                genderSelected: this.f.genderSelected.value,
                userState: 3,
                petStatus: 'No-Perdido',
                isActivated: this.showInputCode,
                photo: this.file
            }

            case false: return {
                _id: this.getLinkIdParam,
                idSecond: this.getLinkIdSecondaryParams,
                codeGenerator: this.f.codeGenerator.value,
                petName: this.f.petName.value,
                phone: this.f.phone.value,
                email: this.f.email.value.toLowerCase(),
                password: this.f.password.value,
                acceptTerms: this.f.acceptTerms.value,
                genderSelected: this.f.genderSelected.value,
                userState: 3,
                petStatus: 'No-Perdido',
                isActivated: this.showInputCode,
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