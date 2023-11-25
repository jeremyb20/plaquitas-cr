import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { NotificationService } from 'src/app/services/notification.service';
import { Notification, NotificationType } from "../../../common/constants";
import { ThemeService } from '@services/theme.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html'
})
export class NotificationsComponent {

  notifications: Notification[] = [];
  private _subscription: Subscription;
  show = true;
  themeSelected: any ='';


  constructor(private _notificationSvc: NotificationService, private _themeService: ThemeService) { }

  private _addNotification(notification: Notification) {
    this.notifications.push(notification);
    if (notification.timeout !== 0) {
      setTimeout(() => {
        this.close(notification)
      }, notification.timeout);
    }
  }

  ngOnInit() {
    this._subscription = this._notificationSvc.getObservable().subscribe(notification => this._addNotification(notification));
    this.themeSelected = this._themeService.getThemeSelected();

  }

  ngOnDestroy() {
    if (this._subscription != undefined)
      this._subscription.unsubscribe();
  }

  close(notification: Notification) {
    notification.classPropAnimation = 'animate__backOutDown';
    setTimeout(() => {
      this.notifications = this.notifications.filter(notif => notif.id !== notification.id);
    }, 1000);
  }


  className(notification: Notification): string {

    let style: string;

    switch (notification.type) {

      case NotificationType.success:
        style = 'success';
        break;

      case NotificationType.warning:
        style = 'warning';
        break;

      case NotificationType.error:
        style = 'error';
        break;

      default:
        style = 'info';
        break;
    }

    return style;
  }

}
