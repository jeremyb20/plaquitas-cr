import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LanguageFilter, ThemesOptions } from '@methods/constants';
import { User } from '@models/auth-model';
import { ApiService } from '@services/api.service';
import { NotificationService } from '@services/notification.service';
import { ThemeService } from '@services/theme.service';
import { TranslationService } from '@services/translate.service';
import { CookieService } from 'ngx-cookie-service';
interface City {
  name: string;
  code: string;
}
@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html'
})
export class ConfigurationComponent implements OnInit {
  smartLoginForm: FormGroup;
  userLogin: User;
  idUser: any;
  themeList: any;
  languageItems: any = [];
  themeSelected: any ='';
  langSelected: any ='';

  cities: City[] | undefined;

  selectedCity: City | undefined;

  get f() { return this.smartLoginForm.controls; }

  constructor(private _formBuilder: FormBuilder, 
    private _apiService: ApiService,
    private _notificationService: NotificationService, 
    private _cookieService: CookieService, 
    private _translationService: TranslationService,
    private _themeService: ThemeService) {
    this.themeList = ThemesOptions;
  }

  ngOnInit() {
    this.userLogin = JSON.parse(localStorage.getItem('user')!);
    this.idUser = localStorage.getItem('IdUser');
    this.themeSelected = this._themeService.getThemeSelected();
    this.langSelected = this._translationService.currentLang();
    this.languageItems = LanguageFilter
  }

  setLanguage(item: any){
    this._translationService.setTranslate(item.value);
    this._notificationService.success('The process was successfully completed.', 'bg-success', 'animate__backInUp', 6000);
  }

  onSetTheme(item) {
    this._themeService.setTheme(item.value);
    this._notificationService.success('The process was successfully completed.', 'bg-success', 'animate__backInUp', 6000);
  }
}
