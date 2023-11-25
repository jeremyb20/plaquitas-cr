import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ApiService } from './api.service';
import { CookieService } from 'ngx-cookie-service';
import { NotificationService } from './notification.service';
@Injectable({
    providedIn: 'root'
})
export class TokenInterceptor implements HttpInterceptor {
  clonedReq: any;
  constructor(public _apiService: ApiService, private _cookieService: CookieService, private _notificationService: NotificationService, private _route: Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>  {
    if (this._cookieService.get('id_token') != null && this._cookieService.get('id_token') != '') {
      sessionStorage.setItem('id_token', this._cookieService.get('id_token'));
      this.clonedReq = request.clone({
        headers: request.headers.set('Authorization', this._cookieService.get('id_token'))
      });

      return next.handle(this.clonedReq).pipe(
        tap(
          {
            next: (result: any) => {
              //console.log(result); //magic should work
            },
            error: (error) => {
              if (error.status == 401) {
                this._notificationService.warning('GENERICS.TOKEN_EXPIRED', 'bg-dark', 'animate__backInUp', 6000);
                this._route.navigate(['/login']);

              }
            }
          }
        )
      )
    }else{
      this._route.navigate(['/login']);
      return next.handle(request.clone())
    }
  }
}
