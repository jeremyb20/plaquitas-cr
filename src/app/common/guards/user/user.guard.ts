import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree, NavigationEnd } from '@angular/router';
import { Observable, filter } from 'rxjs';
import { ApiService } from '@services/api.service';
import { NotificationService } from '@services/notification.service';
import { CookieService } from 'ngx-cookie-service';
import { CounterService } from '@services/counter.service';
import { User } from '@models/auth-model';
@Injectable({
  providedIn: 'root',
})
export class UserGuard {
  actualRoute: any;
  userLogin: User;
  constructor(public _apiService: ApiService, public router: Router, private _notificationService: NotificationService, private _cookieService: CookieService, private _counterService: CounterService) { 

    router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      if (event.url != '/login') {
        this._counterService.ActualRoute(event.url);
        this._apiService.setRouterLink(event.url);
      }
    });
    
  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | UrlTree | boolean {
   
    return true;
  }
}