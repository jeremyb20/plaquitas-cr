import { Component, OnInit } from '@angular/core';
import { OnlineStatusService, OnlineStatusType } from 'ngx-online-status';
import { NotificationService } from './services/notification.service';
import { environment } from '../environments/environment.development';
import { ApiService } from '@services/api.service';
import { PostMethods, getThemeFilter } from '@methods/methods';
import { ThemeService } from '@services/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  location: string = window.location.href;
  themeColor: string = '#1D4A49';
  status: OnlineStatusType; 
  localTheme: string = '';


  constructor(private onlineStatusService: OnlineStatusService, private _notificationService: NotificationService, private _apiService: ApiService, private _themeService: ThemeService ) {
    this.onlineStatusService.status.subscribe((status: OnlineStatusType) => {
      this.status = status;
      if (this.status == 0) {
        this._notificationService.error('Connection has been lost', 'bg-dark', 'animate__backInUp', 6000);
      } else {
        this._notificationService.success('Connection has been established', 'bg-success', 'animate__backInUp', 6000);
      }
    });
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.localTheme = this._themeService.getThemeSelected();
    const dataselected = getThemeFilter(this.localTheme);
    this._themeService.setTheme(dataselected);
  }
}
