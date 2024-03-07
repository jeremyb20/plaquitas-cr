import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '@services/api.service';
import { PostMethods, getSmartLoginTimeOut } from '@methods/methods';
import { environment } from 'src/environments/environment';
import { MediaResponse, MediaService } from '@services/media.service';
import { Subscription } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { ResponseData } from '@models/models';
import { DOCUMENT } from '@angular/common';
import packageJson from '../../../../../package.json';
import { ThemeService } from '@services/theme.service';
import { SwUpdate } from '@angular/service-worker';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
    public version: string = packageJson.version;
    private mediaSubscription: Subscription;
    Media: MediaResponse;
    showPassword: boolean;
    loginForm: FormGroup;
    email: string;
    password: string;
    submitted = false;
    loading: boolean = false;
    timeSeconds: number = 6000;
    messageResult: string = "";
    showInstallButton = false;
    deferredPrompt: any;

    constructor(
        @Inject(DOCUMENT) private document: Document,
        private _apiService: ApiService,
        private _formBuilder: FormBuilder,
        private _router: Router,
        private _mediaService: MediaService,
        private _themeService: ThemeService,
        private _swUpdate: SwUpdate,
        private _cookieService: CookieService) {
        this.mediaSubscription = this._mediaService.subscribeMedia().subscribe(media => {
            this.Media = media;
        });

        let metaTheme =  this.document.getElementById('meta-color') as HTMLMetaElement;
        metaTheme.content = '#29859ef0';
    }

    ngOnInit() {
        this.loginForm = this._formBuilder.group({
            email: ['', [Validators.required]],
            password: ['', [Validators.required]]
        });

        if (this._swUpdate.isEnabled) {
            this._swUpdate.versionUpdates.subscribe((info) => {
              // Actualización disponible, mostrar el botón de instalación
              console.log(info)
              this.showInstallButton = true;
            });

            // Escuchar el evento beforeinstallprompt
            window.addEventListener('beforeinstallprompt', (event: Event) => {
                // Prevenir la instalación automática
                event.preventDefault();

                // Guardar el evento para usarlo posteriormente
                this.deferredPrompt = event;

                // Mostrar el botón de instalación
                this.showInstallButton = true;
            });
        }
    }
    get f() { return this.loginForm.controls; }

    onSubmit() {
        this.submitted = true;
        if (this.loginForm.invalid) {
            return;
        }
        this.loading = true;
        const URL = `${environment.WebApiUrl + PostMethods.POST_LOGIN_USER}`;

        const data = {
            email: this.f.email.value.toLowerCase(),
            password: this.f.password.value
        }

        this._apiService.apiPostMethod(URL, data).subscribe({
            next: (result: ResponseData) => {
                if (result.success) {
                    this.loading = false;
                    this._themeService.setTheme(result.payload.theme ? result.payload.theme : 'theme-default-light')
                    this._apiService.storeUserData(result);
                    switch (result.payload.userState) {
                        case 0:
                            this._router.navigate(['/admin-panel']);
                            break;
                        case 3:
                            this._router.navigate(['/dashboard']);
                            break;

                        default:
                            break;
                    }
                } else {
                    this.loading = false;
                    this.getMessageInfo("Please check your credentials", 3000);
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
        // this._router.navigate(['/register-pets/'],{ queryParams: {id: 0, idSecond: 0, isActivated: false}});
        this._router.navigate(['/register-pets/']); 
    }

    installPWA(){
        if (this.deferredPrompt) {
            // Lanzar la instalación cuando se hace clic en el botón
            this.deferredPrompt.prompt();
      
            // Esperar a que el usuario responda a la instalación
            this.deferredPrompt.userChoice.then((choiceResult: any) => {
              if (choiceResult.outcome === 'accepted') {
                console.log('Usuario aceptó la instalación');
              } else {
                console.log('Usuario canceló la instalación');
              }
      
              // Restablecer deferredPrompt después de la instalación
              this.deferredPrompt = null;
            });
        }
    }

    getMessageInfo(message: string, time: number) {
        this.messageResult = message;
        setTimeout(() => {
            this.messageResult = '';
        }, time);
    }
}
