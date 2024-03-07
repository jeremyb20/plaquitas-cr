/**
Internal Modules
*/
import { NgModule, isDevMode, LOCALE_ID } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from 'src/environments/environment';
import { registerLocaleData } from '@angular/common';
import localeEsCR from '@angular/common/locales/es-CR';
/**
External Modules
*/

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { JwtModule } from "@auth0/angular-jwt";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgHttpLoaderModule } from 'ng-http-loader';
// import { OnlineStatusModule } from 'ngx-online-status';
import { AppRoutingModule } from './app-routing.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgxEditorModule } from "ngx-editor";
import { QRCodeModule } from 'angularx-qrcode';
import { ClipboardModule } from 'ngx-clipboard';
import { NgChartsModule } from 'ng2-charts';
import { GoogleMapsModule } from '@angular/google-maps';
import { ZXingScannerModule } from '@zxing/ngx-scanner';

/**
  PRIME MODULES
*/ 

import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { CarouselModule } from 'primeng/carousel';
import { CheckboxModule } from 'primeng/checkbox';
import { ContextMenuModule } from 'primeng/contextmenu';
import { DialogModule } from 'primeng/dialog';
import { DataViewModule } from 'primeng/dataview';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { GalleriaModule } from 'primeng/galleria';
import { InputMaskModule } from 'primeng/inputmask';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { ProgressBarModule } from 'primeng/progressbar';
import { RatingModule } from 'primeng/rating';
import { SidebarModule } from 'primeng/sidebar';
import { ScrollTopModule } from 'primeng/scrolltop';
import { SliderModule } from 'primeng/slider';
import { TabViewModule } from 'primeng/tabview';
import { TagModule } from 'primeng/tag';
import { TableModule } from 'primeng/table';

/**
Services
*/
import { ThemeService } from '@services/theme.service';
import { NotificationService } from '@services/notification.service';
import { TranslationService } from '@services/translate.service';
import { ApiService } from '@services/api.service';
import { TokenInterceptor } from '@services/token.interceptor';
import { CounterService } from '@services/counter.service';
import { CookieService } from 'ngx-cookie-service';

/**
Components
*/

import { AppComponent } from './app.component';
import { NotificationsComponent } from './core/components/notifications/notifications.component';
import { LoginComponent } from './core/components/login/login.component';
import { NotFoundComponent } from './core/components/not-found/not-found.component';
import { NavbarComponent } from './core/components/navbar/navbar.component';
import { SideNavComponent } from './core/components/sidenav/sidenav.component';
import { MainLayoutComponent } from './core/layouts/main-layout/main-layout.component';
import { HeaderLayoutComponent } from './core/layouts/header-layout/header-layout.component';
import { DashboardComponent } from './core/components/dashboard/dashboard.component';
import { ConfigurationComponent } from './core/components/configuration/configuration.component';

/**
Views
*/
import { HomeComponent } from './core/views/home/home.component';
import { AdminPanelComponent } from './core/views/admin-views/admin-panel/admin-panel.component';
import { GoogleMapsComponent } from './core/components/google-maps/google-maps.component';
import { GenericDataTableComponent } from './core/components/generic-data-table/generic-data-table.component';
import { UserListComponent } from './core/views/admin-views/user-list/user-list.component';
import { CodeGeneratorComponent } from './core/views/admin-views/code-generator/code-generator.component';
import { ProfileComponent } from './core/components/profile/profile.component'; 
import { RegisterComponent } from './core/views/user-views/register/register.component';
import { TermsAndConditionsComponent } from './core/components/terms-and-conditions/terms-and-conditions.component';
import { MyPetCodeComponent } from './core/components/my-pet-code/my-pet-code.component';
import { ExportAsComponent } from '@components/export-as/export-as.component'; 
import { ForgotComponent } from './core/views/user-views/forgot/forgot.component';
import { ResetPasswordComponent } from './core/views/user-views/reset-password/reset-password.component';
import { ScannerComponent } from './core/views/user-views/scanner/scanner.component';
import { DigitalIdentificationComponent } from './core/components/digital-identification/digital-identification.component';
import { PublicProfileComponent } from './core/components/public-profile/public-profile.component';
import { CatalogPanelComponent } from './core/views/admin-views/catalog-panel/catalog-panel.component';
import { PrivacyPolicyComponent } from './core/components/privacy-policy/privacy-policy.component';
import { MarketplaceComponent } from './core/components/marketplace/marketplace.component';
import { MarketItemComponent } from './core/components/market-item/market-item.component';
import { PetProfileComponent } from './core/components/pet-profile/pet-profile.component';
import { GeneralFormComponent } from './core/components/general-form/general-form.component';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

export function tokenGetter() {
  return sessionStorage.getItem("token");
}

registerLocaleData(localeEsCR);
@NgModule({
  declarations: [
    AppComponent,
    NotificationsComponent,
    LoginComponent,
    NotFoundComponent,
    NavbarComponent,
    SideNavComponent,
    MainLayoutComponent,
    HeaderLayoutComponent,
    DashboardComponent,
    ConfigurationComponent,
    HomeComponent,
    AdminPanelComponent,
    GoogleMapsComponent,
    GenericDataTableComponent,
    UserListComponent,
    CodeGeneratorComponent,
    ProfileComponent, 
    RegisterComponent,
    TermsAndConditionsComponent,
    MyPetCodeComponent,
    ExportAsComponent, 
    ForgotComponent,
    ResetPasswordComponent,
    ScannerComponent,
    DigitalIdentificationComponent,
    PublicProfileComponent,
    CatalogPanelComponent,
    PrivacyPolicyComponent,
    MarketplaceComponent,
    MarketItemComponent,
    PetProfileComponent,
    GeneralFormComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    // OnlineStatusModule,
    HttpClientModule,
    TableModule,
    CalendarModule,
    SliderModule,
    DialogModule,
    DataViewModule,
    MultiSelectModule,
    ContextMenuModule,
    DropdownModule,
    ButtonModule,
    CardModule,
    InputTextModule,
    InputSwitchModule,
    InputMaskModule,
    ProgressBarModule,
    TabViewModule,
    CheckboxModule,
    DragDropModule,
    FontAwesomeModule,
    TagModule,
    BrowserAnimationsModule,
    FileUploadModule,
    GoogleMapsModule,
    QRCodeModule,
    ClipboardModule,
    NgChartsModule,
    ScrollTopModule,
    RatingModule,
    InputNumberModule,
    InputTextareaModule,
    ZXingScannerModule,
    SidebarModule,
    CarouselModule,
    GalleriaModule,
    NgxEditorModule.forRoot({
      locals: {
        // menu
        bold: 'Bold',
        italic: 'Italic',
        code: 'Code',
        underline: 'Underline',
        strike: 'Strike',
        blockquote: 'Blockquote',
        bullet_list: 'Bullet List',
        ordered_list: 'Ordered List',
        heading: 'Heading',
        h1: 'Header 1',
        h2: 'Header 2',
        h3: 'Header 3',
        h4: 'Header 4',
        h5: 'Header 5',
        h6: 'Header 6',
        align_left: 'Left Align',
        align_center: 'Center Align',
        align_right: 'Right Align',
        align_justify: 'Justify',
        text_color: 'Text Color',
        background_color: 'Background Color',
        insertLink: 'Insert Link',
        removeLink: 'Remove Link',
        insertImage: 'Insert Image',
    
        // pupups, forms, others...
        url: 'URL',
        text: 'Text',
        openInNewTab: 'Open in new tab',
        insert: 'Insert',
        altText: 'Alt Text',
        title: 'Title',
        remove: 'Remove',
      },
    }),
    NgHttpLoaderModule.forRoot(),
    NgHttpLoaderModule.forRoot(),
    TranslateModule.forRoot({ 
      defaultLanguage: 'es',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ["localhost:3001", "localhost:4200", "foo.com", "bar.com"],
        disallowedRoutes: ["http://example.com/examplebadroute/"],
      },
    }),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
  ],
  providers: [
    ThemeService,
    NotificationService,
    CounterService,
    TranslationService,
    ApiService,
    CookieService,
    provideClientHydration(), 
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    {
        provide: LOCALE_ID,
        useValue: 'es-CR'
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
