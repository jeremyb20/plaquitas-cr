import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree, NavigationEnd } from '@angular/router';
import { Observable, filter } from 'rxjs';
import { ApiService } from '@services/api.service';
import { NotificationService } from '@services/notification.service';
import { CookieService } from 'ngx-cookie-service';
import { CounterService } from '@services/counter.service';
import { Location } from '@angular/common';
import { User } from '@models/auth-model';


@Injectable({
    providedIn: 'root'
})

export class AdminGuard {
    actualRoute: any;
    userLogin: User
    previousUrl: string = '';
    currentUrl: string = '';
    constructor(private _location: Location, public _apiService: ApiService, public _router: Router, private _notificationService: NotificationService, private _cookieService: CookieService, private _counterService: CounterService) {
        _router.events.pipe(
            filter(event => event instanceof NavigationEnd)
        ).subscribe((event: any) => {
            if (event.url != '/login') {
                this.previousUrl = this.currentUrl;
                this.currentUrl = event.url;
                this._counterService.ActualRoute(event.url);
                this._apiService.setRouterLink(event.url);
            }
        });
    }
    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> | Promise<boolean> | UrlTree | boolean {
        const cookie = this._cookieService.get("id_token");
        this.userLogin = JSON.parse(localStorage.getItem('user')!);
        if (this.userLogin) {
            if (cookie == '') {
                this._notificationService.warning('The token has expired', 'bg-dark', 'animate__backInUp', 6000);
                this._apiService.logout();
            } else if (this.userLogin.userState != 0) {
                this._notificationService.warning('Access Denied', 'bg-dark', 'animate__backInUp', 6000);
                if (window.history.length > 1) {
                    this._location.back()
                }
            }
        } else {
            this._notificationService.warning('Access Denied', 'bg-dark', 'animate__backInUp', 6000);
            this._apiService.logout();
            return false;
        }

        return true;
    }
}