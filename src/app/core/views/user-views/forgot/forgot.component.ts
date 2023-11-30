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
    selector: 'app-forgot',
    templateUrl: './forgot.component.html'
})
export class ForgotComponent implements OnInit {
    private mediaSubscription: Subscription;
    Media: MediaResponse;
    showPassword: boolean;
    forgotPassword: FormGroup;
    email: string;
    password: string;
    submitted = false;
    loading: boolean = false;
    timeSeconds: number = 6000;
    messageResult: string = "";

    constructor(
        private _apiService: ApiService,
        private _formBuilder: FormBuilder,
        private _translateService: TranslateService,
        private _router: Router) {
    }

    ngOnInit() {
        this.forgotPassword = this._formBuilder.group({
            email: ['', [Validators.required]]
        });
    }

    get f() { return this.forgotPassword.controls; }

    onSubmit() {
        this.submitted = true;
        if (this.forgotPassword.invalid) {
            return;
        }
        this.loading = true;
        const URL = `${environment.WebApiUrl + PostMethods.POST_FORGOT_PASSWORD}`;

        const data = {
            email: this.f.email.value,
        }

        this._apiService.apiPostMethod(URL, data).subscribe({
            next: (result: ResponseData) => {
                if (result.success) {
                    this.loading = false;
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
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

    goToRegisterPets(){
        this._router.navigate(['/register-pets/'],{ queryParams: {id: 0, idSecond: 0, isActivated: false}}); 
    }

    TranslateText(text: string) {
        return this._translateService.instant(text);
    }

    getMessageInfo(message: string, time: number) {
        this.messageResult = message;
        setTimeout(() => {
            this.messageResult = '';
        }, time);
    }

}
