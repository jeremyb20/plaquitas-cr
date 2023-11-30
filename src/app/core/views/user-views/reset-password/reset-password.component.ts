import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '@services/api.service';
import { MustMatch, PostMethods } from '@methods/methods';
import { environment } from 'src/environments/environment';
import { MediaResponse, MediaService } from '@services/media.service';
import { Subscription } from 'rxjs';
import { ResponseData } from '@models/models';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.component.html',
})
export class ResetPasswordComponent implements OnInit {
    private mediaSubscription: Subscription;
    Media: MediaResponse;
    resetPassword: FormGroup;
    email: string;
    password: string;
    submitted = false;
    loading: boolean = false;
    timeSeconds: number = 6000;
    messageResult: string = "";
    showPassword: boolean = false;
    showPassword2: boolean = false;
    resetToken: null;

    constructor(
        private _apiService: ApiService,
        private _formBuilder: FormBuilder,
        private _router: Router,
        private route: ActivatedRoute,
        private _translateService: TranslateService
        ) {
        this.route.params.subscribe(params => {
            this.resetToken = params.token; 
        });
    }

    ngOnInit() {
        this.resetPassword = this._formBuilder.group({
            password: new FormControl('', [Validators.required, Validators.minLength(6)]),
            confirmPassword: new FormControl('', [Validators.required, Validators.minLength(6)]),
        },{
            validator: MustMatch('password', 'confirmPassword')
        });
    }
    get f() { return this.resetPassword.controls; }

    onSubmit() {
        this.submitted = true;
        if (this.resetPassword.invalid) {
            return;
        }
        this.loading = true;
        const URL = `${environment.WebApiUrl + PostMethods.POST_RESET_PASSWORD}`;

        const data = {
            password: this.f.password.value,
            token: this.resetToken
        }

        this._apiService.apiPostMethod(URL, data).subscribe({
            next: (result: ResponseData) => {
                if (result.success) {
                    this.loading = false;
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: this.TranslateText('Password change successfully'),
                        html: this.TranslateText(result.msg),
                        allowOutsideClick: false,
                        confirmButtonText: 'OK',
                    })
                    .then((result) => {
                        if (result.value) {
                            this._router.navigate(['/login']);
                        }
                    });
                    
                } else {
                    this.loading = false;
                    this.getMessageInfo(result.msg, 5000);
                }
            },
            error: (err: any) => {
                console.log(err);
                this.loading = false;
                this.getMessageInfo("Something went wrong please try again or contact with you administrator", 6000);
            }
        });
    }

    TranslateText(text: string) {
        return this._translateService.instant(text);
    }

    goToRegisterPets(){
        this._router.navigate(['/register-pets/'],{ queryParams: {id: 0, idSecond: 0, isActivated: false}}); 
    }

    getMessageInfo(message: string, time: number) {
        this.messageResult = message;
        setTimeout(() => {
            this.messageResult = '';
        }, time);
    }
}
