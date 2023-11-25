import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NotificationService } from 'src/app/services/notification.service';
import { LanguageFilter, NAVIGATION, NAVIGATIONADMIN } from "src/app/common/constants";
import { ApiService } from '@services/api.service';
import { MediaResponse, MediaService } from '@services/media.service';
import { environment } from 'src/environments/environment';
import { PostMethods, getSmartLoginTimeOut } from '@methods/methods';
import { User } from '@models/auth-model';
import { CookieService } from 'ngx-cookie-service';
import { TranslationService } from '@services/translate.service';
import { Filters } from '@models/models';

declare const bootstrap: any;

interface Column {
  ticket: string;
  view: string;
}

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html'
})
export class NavbarComponent {
  @Input() isExpanded : boolean;
  private mediaSubscription: Subscription;
  Media: MediaResponse;
  navigation: any;
  submitted = false;
  userName: any = '';
  idUser: any;
  generalSearchModal: any;
  userLogin: User;
  loading: boolean = false;
  ticketData!: any[];
  cols!: Column[];
  showTable: boolean = false;
  isAccountSelected: number = 0;
  smartLoginForm: FormGroup;
  userActive: string = '';
  messageResult: string = "";
  langFilter: Filters[]
  langItemSelected: any;

  get f() { return this.smartLoginForm.controls; }


  constructor(private _media: MediaService, private _apiService: ApiService, private _formBuilder: FormBuilder, private _cookieService: CookieService,
    private router: Router, private _notificationService: NotificationService, private _translationService: TranslationService) {
    this.mediaSubscription = this._media.subscribeMedia().subscribe(media => {
      this.Media = media;
    });

    this.langFilter = LanguageFilter;
  }

  ngOnInit(): void {
    this.userLogin = JSON.parse(localStorage.getItem('user')!);
    if(this.userLogin){
      this.getModalInit();
      this.getMenuItemByUser();
    }
    
  }

  getMenuItemByUser() {
    if(this.userLogin.userState == 0){
      this.navigation = NAVIGATIONADMIN;
    }else{
      this.navigation = NAVIGATION;
    }
  }

  langSelected(pItem:Filters){
    this._translationService.setTranslate(pItem.value);
    this._notificationService.success('The information was updated correctly', 'bg-success', 'animate__backInUp', 6000);
    // this.langItemSelected = pItem;
    // const data = this.OnSendDataPayload(1);
    // const URL = `${environment.WebApiUrl + this.onSendURLParameter(1) }`;
    // this._apiService.apiPostMethod(URL, data).subscribe({
    //   next: (result: any) => {
    //     if (result != '-1') {
    //       this._translationService.setTranslate(pItem.value);
    //       this._notificationService.success('The information was updated correctly', 'bg-success', 'animate__backInUp', 6000);
    //     }
    //   },
    //   error: (err: any) => {
    //     console.log(err);
    //     this._notificationService.warning('An error occurred in the process.', 'bg-dark', 'animate__backInUp', 6000);
    //   }
    // });
  }

  onSubmit() {
   
  }

  scanQRCode(){
    
  }

  GeneralSearch() {
    this.generalSearchModal.show();
  }

  getTableInfo(pTicket: number) {
  }

  logout() {
    this._apiService.logout();
  }

  itemSelected(item){
    
  }

  OnSendDataPayload(key: number){
   
  }

  onSendURLParameter(key: number){
    switch (key) {
      case 1: return PostMethods.POST_UPDATE_LANGUAGE_BY_USER;  
      default: return null;
    } 
  }

  getModalInit() {
    this.generalSearchModal = new bootstrap.Modal(document.getElementById('generalSearchModal'), {
      keyboard: false
    })
  }

  getMessageInfo(message: string, time: number) {
    this.messageResult = message;
    setTimeout(() => {
      this.messageResult = '';
    }, time);
  }
}
