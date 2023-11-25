/**
Internal Modules
*/
import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from 'src/environments/environment';
/**
External Modules
*/

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { JwtModule } from "@auth0/angular-jwt";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgHttpLoaderModule } from 'ng-http-loader';
import { OnlineStatusModule } from 'ngx-online-status';
import { AppRoutingModule } from './app-routing.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgxEditorModule } from "ngx-editor";
import { QRCodeModule } from 'angularx-qrcode';
import { ClipboardModule } from 'ngx-clipboard';
import { NgChartsModule } from 'ng2-charts';
import { GoogleMapsModule } from '@angular/google-maps';
/**
  PRIME MODULES
*/ 

import { TableModule } from 'primeng/table';
import { CalendarModule } from 'primeng/calendar';
import { SliderModule } from 'primeng/slider';
import { DialogModule } from 'primeng/dialog';
import { MultiSelectModule } from 'primeng/multiselect';
import { ContextMenuModule } from 'primeng/contextmenu';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressBarModule } from 'primeng/progressbar';
import { DropdownModule } from 'primeng/dropdown';
import { CardModule } from 'primeng/card';
import { InputSwitchModule } from 'primeng/inputswitch';
import { TabViewModule } from 'primeng/tabview';
import { TagModule } from 'primeng/tag';
import { CheckboxModule } from 'primeng/checkbox';
import { InputMaskModule } from 'primeng/inputmask';
import { FileUploadModule } from 'primeng/fileupload';
import { ScrollTopModule } from 'primeng/scrolltop';


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
import { RegisterFormComponent } from './core/components/register-form/register-form.component';
import { RegisterComponent } from './core/views/user-views/register/register.component';
import { TermsAndConditionsComponent } from './core/components/terms-and-conditions/terms-and-conditions.component';
import { MyPetCodeComponent } from './core/components/my-pet-code/my-pet-code.component';
import { ExportAsComponent } from '@components/export-as/export-as.component';
import { EditComponentComponent } from './core/components/edit-component/edit-component.component';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

export function getLang(){
  const lang = localStorage.getItem('lang')!
  return lang != null ? lang : 'es';
}

export function tokenGetter() {
  return sessionStorage.getItem("token");
}
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
    RegisterFormComponent,
    RegisterComponent,
    TermsAndConditionsComponent,
    MyPetCodeComponent,
    ExportAsComponent,
    EditComponentComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    OnlineStatusModule,
    HttpClientModule,
    TableModule,
    CalendarModule,
    SliderModule,
    DialogModule,
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
      defaultLanguage: getLang(),
      //defaultLanguage: 'en',
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
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
