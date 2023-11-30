import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard } from '@methods/guards/admin/admin.guard';
import { UserGuard } from '@methods/guards/user/user.guard';

import { MainLayoutComponent } from './core/layouts/main-layout/main-layout.component';
import { HeaderLayoutComponent } from './core/layouts/header-layout/header-layout.component';
import { LoginComponent } from '@components/login/login.component';
import { NotFoundComponent } from '@components/not-found/not-found.component';
/**
  ADMIN ROUTES
*/ 
import { DashboardComponent } from '@components/dashboard/dashboard.component';
import { ConfigurationComponent } from '@components/configuration/configuration.component';


import { HomeComponent } from '@views/home/home.component';
import { AdminPanelComponent } from '@views/admin-views/admin-panel/admin-panel.component';
import { UserListComponent } from '@views/admin-views/user-list/user-list.component';
import { CodeGeneratorComponent } from '@views/admin-views/code-generator/code-generator.component';
import { ProfileComponent } from '@components/profile/profile.component';
import { RegisterComponent } from '@views/user-views/register/register.component';
import { MyPetCodeComponent } from '@components/my-pet-code/my-pet-code.component';
import { ForgotComponent } from '@views/user-views/forgot/forgot.component';
import { ResetPasswordComponent } from '@views/user-views/reset-password/reset-password.component';



const routes: Routes = [
  {
    path: '',
    component: HeaderLayoutComponent,
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login', component: LoginComponent },
    //   { path: 'home', component: HomeComponent },
      { path: 'register-pets/:id/:idSecond/:isActivated', component: RegisterComponent },
      { path: 'register-pets', component: RegisterComponent },
      { path: 'myPetCode/:id/:idSecond', component: MyPetCodeComponent },
      { path: 'myPetCode', component: MyPetCodeComponent},
      { path: 'forgot', component: ForgotComponent },
      { path: 'reset-password/:token', component: ResetPasswordComponent }
    ]
  },
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent, canActivate: [UserGuard] },
      { path: 'configuration', component: ConfigurationComponent, canActivate: [UserGuard] },
      { path: 'configuration-admin', component: ConfigurationComponent, canActivate: [AdminGuard] },
      { path: 'admin-panel', component: AdminPanelComponent, canActivate: [AdminGuard] },
      { path: 'user-registered', component: UserListComponent, canActivate: [AdminGuard] },
      { path: 'code-generator', component: CodeGeneratorComponent, canActivate: [AdminGuard] },
      { path: 'profile', component: ProfileComponent, canActivate: [UserGuard] },
      { path: 'myPetCode', component: MyPetCodeComponent},
    ]
  },
  { path: '404', component: NotFoundComponent },
  { path: '**', redirectTo: '/404', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
