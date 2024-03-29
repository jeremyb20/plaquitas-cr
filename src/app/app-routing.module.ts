import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard } from '@methods/guards/admin/admin.guard';
import { UserGuard } from '@methods/guards/user/user.guard';

import { MainLayoutComponent } from './core/layouts/main-layout/main-layout.component';
import { HeaderLayoutComponent } from './core/layouts/header-layout/header-layout.component';

/**
  ADMIN ROUTES
*/ 
import { HomeComponent } from '@views/home/home.component';
import { AdminPanelComponent } from '@views/admin-views/admin-panel/admin-panel.component';
import { UserListComponent } from '@views/admin-views/user-list/user-list.component';
import { CodeGeneratorComponent } from '@views/admin-views/code-generator/code-generator.component';
import { CatalogPanelComponent } from '@views/admin-views/catalog-panel/catalog-panel.component';

/**
  USER ROUTES
*/ 

import { RegisterComponent } from '@views/user-views/register/register.component';
import { ForgotComponent } from '@views/user-views/forgot/forgot.component';
import { ResetPasswordComponent } from '@views/user-views/reset-password/reset-password.component';
import { ScannerComponent } from '@views/user-views/scanner/scanner.component';


/**
  COMPONENTS
*/ 
import { LoginComponent } from '@components/login/login.component';
import { NotFoundComponent } from '@components/not-found/not-found.component';
import { DashboardComponent } from '@components/dashboard/dashboard.component';
import { ConfigurationComponent } from '@components/configuration/configuration.component';
import { MyPetCodeComponent } from '@components/my-pet-code/my-pet-code.component';
import { ProfileComponent } from '@components/profile/profile.component';
import { TermsAndConditionsComponent } from '@components/terms-and-conditions/terms-and-conditions.component';
import { PrivacyPolicyComponent } from '@components/privacy-policy/privacy-policy.component';
import { MarketplaceComponent } from '@components/marketplace/marketplace.component';
import { MarketItemComponent } from '@components/market-item/market-item.component';
import { PetProfileComponent } from '@components/pet-profile/pet-profile.component';



const routes: Routes = [
  {
    path: '',
    component: HeaderLayoutComponent,
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login', component: LoginComponent },
      { path: 'home', component: HomeComponent },
      { path: 'inicio', component: HomeComponent },
      { path: 'register-pets/:id/:idSecond/:isActivated', component: RegisterComponent },
      { path: 'register-pets', component: RegisterComponent },
      { path: 'myPetCode/:id/:idSecond', component: MyPetCodeComponent },
      { path: 'pet/:id/:idSecond', component: PetProfileComponent },
      { path: 'myPetCode', component: MyPetCodeComponent},
      { path: 'marketplace', component: MarketplaceComponent},
      { path: 'marketplace/item/:id', component: MarketItemComponent},
      { path: 'forgot', component: ForgotComponent },
      { path: 'reset-password/:token', component: ResetPasswordComponent },
      { path: 'terms-and-condition', component: TermsAndConditionsComponent },
      { path: 'privacy-policy', component: PrivacyPolicyComponent },
    ]
  },
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent, canActivate: [UserGuard] }, 
      { path: 'admin-panel', component: AdminPanelComponent, canActivate: [AdminGuard] },
      { path: 'user-registered', component: UserListComponent, canActivate: [AdminGuard] },
      { path: 'code-generator', component: CodeGeneratorComponent, canActivate: [AdminGuard] },
      { path: 'catalog-panel', component: CatalogPanelComponent, canActivate: [AdminGuard] },
      { path: 'profile', component: ProfileComponent, canActivate: [UserGuard] },
      { path: 'marketplace-admin', component: MarketplaceComponent, canActivate: [AdminGuard]},
      { path: 'Marketplace', component: MarketplaceComponent, canActivate: [UserGuard]},
      { path: 'myPetCode', component: MyPetCodeComponent},
      { path: 'pet', component: PetProfileComponent },

      { path: 'scanner', component: ScannerComponent},
    ]
  },
  { path: '404', component: NotFoundComponent },
  { path: '**', redirectTo: '/404', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabledBlocking'
})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
