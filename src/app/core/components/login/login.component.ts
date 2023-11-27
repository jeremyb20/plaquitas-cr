import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '@services/api.service';
import { PostMethods, getSmartLoginTimeOut } from '@methods/methods';
import { environment } from 'src/environments/environment';
import { MediaResponse, MediaService } from '@services/media.service';
import { Subscription } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { ResponseData } from '@models/models';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  private mediaSubscription: Subscription;
  Media: MediaResponse;
  showPassword: boolean;
  loginForm: FormGroup;
  email: string;
  password: string;
  submitted = false;
  loading: boolean = false;
  timeSeconds: number =  6000;
  messageResult: string = "";


  constructor(
    private _apiService: ApiService,
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _mediaService: MediaService,
    private _cookieService: CookieService) {
    this.mediaSubscription = this._mediaService.subscribeMedia().subscribe(media => {
      this.Media = media;
    });
  }

  ngOnInit() {
    this.loginForm =  this._formBuilder.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
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
      email: this.f.email.value,
      password: this.f.password.value
    }

    this._apiService.apiPostMethod(URL, data).subscribe({
      next: (result: ResponseData) => {
        if (result.success) {
          this.loading = false;
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

  getMessageInfo(message: string, time: number) {
    this.messageResult = message;
    setTimeout(() => {
      this.messageResult = '';
    }, time);
  }
}
