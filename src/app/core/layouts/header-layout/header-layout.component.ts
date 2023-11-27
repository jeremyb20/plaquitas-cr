import { Component } from '@angular/core';
import { ThemesOptions } from '@methods/constants';
import { Filters } from '@models/models';
import { ThemeService } from '@services/theme.service';

@Component({
  selector: 'app-header-layout',
  templateUrl: './header-layout.component.html'
})
export class HeaderLayoutComponent {
    themeList: any = Filters;
  opacity: string = '0.9';


    constructor(private _themeService: ThemeService,){
        this._themeService._ActualTheme.subscribe(data => {
            this.themeList = ThemesOptions.find( theme => theme.value == data );
          });      
    }
}
