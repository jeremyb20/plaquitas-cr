import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';

import { AppModule } from './app.module';
import { AppComponent } from './app.component';
import { MarketItemComponent } from '@components/market-item/market-item.component';
import { RouterModule, Routes } from '@angular/router';
import { HeaderLayoutComponent } from './core/layouts/header-layout/header-layout.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';  
import { ThemeService } from '@services/theme.service';
import { MyPetCodeComponent } from '@components/my-pet-code/my-pet-code.component';
const routes: Routes = [ {
    path: '',
    component: HeaderLayoutComponent,
    children: [
            { path: '', redirectTo: 'marketplace/item', pathMatch: 'full' }, 
            { path: 'marketplace/item/:id', component: MarketItemComponent},
            { path: 'myPetCode/:id/:idSecond', component: MyPetCodeComponent },
        ]
    }
]


@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    TranslateModule.forRoot(),
    ServerModule,
  ],
  providers: [
    ThemeService,
    TranslateService
  ],
  bootstrap: [AppComponent],
})
export class AppServerModule {}
