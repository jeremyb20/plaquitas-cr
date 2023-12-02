import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { getSmartLoginTimeOut } from '@methods/methods';
import { ResponseData } from '@models/models';


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private _http: HttpClient, private _route: Router, private _cookieService: CookieService) { }

  apiPostMethod(URL: string, body: any): Observable<ResponseData> {
    return this._http.post<ResponseData>(URL, body);
  }

  apiGetMethod(URL: string): Observable<ResponseData> {
    return this._http.get<ResponseData>(URL);
  }

  apiPutMethod(URL: string, body: any): Observable<ResponseData> {
    return this._http.put<ResponseData>(URL, body);
  }

  apiDeleteMethod(URL: string, body: any): Observable<any> {
    return this._http.delete<any>(URL, body);
  }

  getRouterLink() {
    return localStorage.getItem('route');
  }

  setRouterLink(router: any) {
    localStorage.setItem('route', router);
  }

  setPermissionByMenu(permission: any) {
    localStorage.setItem('permissionByMenu', permission);
  }

  changedetected(isDetected: any) {
    localStorage.setItem('isDetected', isDetected);
  }

  getDetectionChanges() {
    return localStorage.getItem('isDetected');
  }

  storeUserData(data) {
    localStorage.setItem('user', JSON.stringify(data.payload));
    localStorage.setItem('idUser', JSON.stringify(data.payload.id));
    localStorage.setItem('lang', data.payload.lang == undefined ? 'es' : data.payload.lang );
    localStorage.setItem('id_token', JSON.stringify(data.token));
    this._cookieService.set('id_token', data.token, getSmartLoginTimeOut());
  }

  logout() {
    // if (document.body) {
    //   document.body.classList.remove(localStorage.getItem('theme')!);
    // }
    sessionStorage.clear();
    this._cookieService.delete('id_token')
    localStorage.clear();
    if (this._cookieService.get('isSmartLogin') == 'false') {
      this._cookieService.deleteAll();
    }

    this._route.navigate(['/login']);
    location.reload();
  }
}
