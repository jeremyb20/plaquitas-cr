import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ThemeService } from 'src/app/services/theme.service';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MediaResponse, MediaService } from "src/app/services/media.service";
import { Spinkit } from 'ng-http-loader';
import { Filters } from '@models/models';
import { ThemesOptions } from '@methods/constants';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent implements OnDestroy {
  Media!: MediaResponse;
  private mediaSubscription: Subscription;
  title: string = '';
  sidebarExpanded: boolean = false;
  routeState: string = '';
  themeList: any = Filters;
  user!: [];
  selectTheme = new FormControl('theme-default-light');

  public spinkit = Spinkit;
  opacity: string = '0.9';

  constructor(private router: Router, private _themeService: ThemeService, private _media: MediaService) {
    this.mediaSubscription = this._media.subscribeMedia().subscribe(media => {
      this.Media = media;
      this.sidebarExpanded = media.IsMobile ? false : true;
    });

    this._themeService._ActualTheme.subscribe(data => {
      this.themeList = ThemesOptions.find( theme => theme.value == data );
    });

    let themeSelected = this._themeService.getThemeSelected();
    if (themeSelected) {
      this._themeService.setTheme(themeSelected);
      this.selectTheme = new FormControl(themeSelected);
    } else {
      this._themeService.setTheme('theme-default-light');
    }
    this.selectTheme.valueChanges.subscribe((value) => {
      this._themeService.setTheme(value);
    });
  }

  ngOnDestroy() {
    if (this.mediaSubscription) {
      this.mediaSubscription.unsubscribe();
    }
  }
}
