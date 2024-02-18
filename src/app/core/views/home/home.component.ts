import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';

import { NotificationService } from '@services/notification.service';
import { MediaService, MediaResponse } from '@services/media.service';
import { Subscription } from 'rxjs';
import { ThemeService } from '@services/theme.service';


@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    private mediaSubscription: Subscription;
    Media: MediaResponse;
    isNavbarTransparent = true;

    constructor(
        private media: MediaService,
        private _notificationSvc: NotificationService,
        private _themeService: ThemeService,
        private router: Router) {
        this.mediaSubscription = this.media.subscribeMedia().subscribe(result => {
            this.Media = result;
        });

    }

    ngOnInit() {
        this._themeService.setTheme('theme-default-light')
    }
    @HostListener('window:scroll', ['$event'])
    onWindowScroll() {
        // Verifica la posición del scroll
        if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
            this.isNavbarTransparent = false;

            //   if (document.body.scrollTop > 840 || document.documentElement.scrollTop > 840) {
            //     this.isNavbarTransparent = true;

            //   }
        } else {
            this.isNavbarTransparent = true;
        }
    }

    showMovileNav() {
        this.isNavbarTransparent = false;
    }


}
