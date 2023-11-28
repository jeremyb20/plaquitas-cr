import { Component, EventEmitter, Input, Output, ElementRef, OnInit, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { MediaResponse, MediaService } from "src/app/services/media.service";
import { AUTO_STYLE, animate, state, style, transition, trigger } from '@angular/animations';
import { NAVIGATION, NAVIGATIONADMIN } from "src/app/common/constants";
import Swal from 'sweetalert2';
import packageJson from '../../../../../package.json';
import { TranslateService } from "@ngx-translate/core";
import { ApiService } from "@services/api.service";
import { environment } from "src/environments/environment";
import { PostMethods } from "@methods/methods";
import { User } from "@models/auth-model";
import { CounterService } from "@services/counter.service";
import { Title } from "@angular/platform-browser";
declare const bootstrap: any;

const DEFAULT_DURATION = 200;

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  animations: [
    trigger('collapse', [
      state('false', style({ height: AUTO_STYLE, visibility: AUTO_STYLE })),
      state('true', style({ height: '0', visibility: 'hidden' })),
      transition('false => true', animate(DEFAULT_DURATION + 'ms ease-in')),
      transition('true => false', animate(DEFAULT_DURATION + 'ms ease-out'))
    ])
  ]
})

export class SideNavComponent implements OnInit, OnDestroy {
  public version: string = packageJson.version;
  @Input() isExpanded: boolean = false;
  @Output() toggleSidebar: EventEmitter<boolean> = new EventEmitter<boolean>();
  handleSidebarToggle = () => this.toggleSidebar.emit(!this.isExpanded);
  output: boolean = false;
  openAccordion: any = [];
  Media!: MediaResponse;
  navigation: any;
  idUser: string | null = '';
  loading: boolean = false;
  actualRouter: string | null = '';
  hasSub!: [];
  changeDetected: any;
  nameUser: any;
  hidebackdrop: any;
  offcanvasExample: any;

  userLogin: User;

  newMessagesCount: number = 0;
  pendingTicketsCount: number =0;
  helpNotifications: number =0;
  internalNotifications: number =0;
  partnerNotifications: number =0;
  directNotifications: number = 0;

  private mediaSubscription: Subscription

  showSubmenu(itemEl: HTMLElement) {
    itemEl.classList.toggle("showMenu");
  }

  constructor(private el: ElementRef, private _apiService: ApiService, private _media: MediaService, private router: Router, private _translateService: TranslateService, private _counterService: CounterService, private readonly _title: Title) {
    this.actualRouter = this._apiService.getRouterLink();
    this.mediaSubscription = this._media.subscribeMedia().subscribe(media => {
      this.Media = media;
      if(!media.IsMobile){
        this.CloseToogle();
      }
    });
  }

  ngOnInit(): void { 
    this.offcanvasExample = new bootstrap.Offcanvas((<HTMLInputElement>document.getElementById("offcanvasExample")), {
      keyboard: false
    });

    this.userLogin = JSON.parse(localStorage.getItem('user')!);

    this._counterService._Counter.subscribe(count => {
      this.newMessagesCount = count;
    });

    this._counterService._CounterPendingTickets.subscribe(count => {
      this.pendingTicketsCount = count;
    });

    this._counterService._CounterHelpNotifications.subscribe(count => {
      this.helpNotifications = count;
    });

    this._counterService._CounterInternalNotifications.subscribe(count => {
      this.internalNotifications = count;
    });

    this._counterService._CounterPartnerNotifications.subscribe(count => {
      this.partnerNotifications = count;
    });

    this._counterService._CounterDirectNotifications.subscribe(count => {
      this.directNotifications = count;
    });

    if(this.userLogin){
      this.getMenuItemByUser();
    }

    this._counterService._CounterActualRoute.subscribe(data => {
      if(data != null){
        this.actualRouter = data;
      }else{
        this._apiService.setRouterLink(this.navigation[0].url);
        this.actualRouter = this.navigation[0].url;
      }
    })
   
  }

  getMenuItemByUser() {
    if(this.userLogin.userState == 0){
      this.navigation = NAVIGATIONADMIN;
    }else{
      this.navigation = NAVIGATION;
    }
  }

  toggle(i:any){
    this.openAccordion[i] = !this.openAccordion[i];
  }

  getActualRoute(){
    this.actualRouter = this._apiService.getRouterLink();
  }

  logout(){
    this._apiService.logout();
  }

  checkRoute(navigation:any){
    const foundRouter =  navigation.map((val:any, index:any) => {
      if(navigation[index].SubMenu.length>0){
        this.hasSub = navigation[index].SubMenu.map((item: any) => {
          return item.routerLink == this.actualRouter;
        })
      }
      return ( this.hasSub.length > 0 )? this.hasSub: val.routerLink == this.actualRouter;
    });
    if(foundRouter.length == 0){
      if(this.actualRouter != '/profile' && this.actualRouter != '/configuration'){
        this.router.navigate([this.navigation[0].routerLink]);
      }
    }
    this._apiService.setPermissionByMenu(true);
  }

  goTo(route:any, isExternalRoute: boolean){
    this.changeDetected = (this._apiService.getDetectionChanges() == 'true')? true: false;
    if(this.changeDetected){
      Swal.fire({
        title: 'Estás seguro?',
        text: "Los cambios no se guardarán y no podrás revertir esto.!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, salir!',
        cancelButtonText: 'Cancelar!'
      }).then((result) => {
        if (result.isConfirmed) {
          this.CloseToogle();
          this.actualRouter = route;
          this.router.navigate([route]);
          this.validateTitle(route, isExternalRoute);
          this._apiService.changedetected(false);
        }
      })
    } else {
      this.CloseToogle();
      this.validateTitle(route, isExternalRoute);
      this.actualRouter = route;
      this.router.navigate([route]);
    }
  }

  TranslateText(text: string) {
    return this._translateService.instant(text);
  }

  CloseToogle() {
    if(this.offcanvasExample)
    this.offcanvasExample.hide();
  }

  ngOnDestroy(): void {
    if (this.mediaSubscription)
      this.mediaSubscription.unsubscribe();
  }

  validateTitle(route: any, isExternalRoute: boolean) {
    if(!isExternalRoute){
      const found = this.navigation.find(el =>  el.url == route ).title;
      this._title.setTitle(`${ this.TranslateText(found)} | Plaquitas CR `);
    }else{
      this._title.setTitle(`${ this.TranslateText(route)} | Plaquitas CR `);
    }
  }
  
}
