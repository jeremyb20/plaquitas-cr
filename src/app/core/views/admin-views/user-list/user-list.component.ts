import { Component, OnInit } from '@angular/core';
import { ColumHeader } from '@methods/constants';
import { GetMethods, responseError } from '@methods/methods';
import { ResponseData } from '@models/models';
import { ApiService } from '@services/api.service';
import { NotificationService } from '@services/notification.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html'
})
export class UserListComponent implements OnInit {
    columsData: ColumHeader[] = [];
    payloadData: any;
    loading: boolean = false;
    showHardReloadBtn: boolean = false;

    constructor(private _apiService: ApiService, private _notificationService: NotificationService){}

    ngOnInit() {
        this.columsData = [
            { field: 'moreOptions', header: '+', title: '+', showInPrimaryHeader: true, showInSecondaryHeader: false},
            { field: 'id', header: 'Id', title: 'Id', showInPrimaryHeader: true, showInSecondaryHeader: true},
            { field: 'petName', header: 'Pet Name', title: 'Pet Name', showInPrimaryHeader: true, showInSecondaryHeader: true},
            { field: 'email', header: 'Email', title: 'Email', showInPrimaryHeader: true, showInSecondaryHeader: true},
            { field: 'phone', header: 'Phone', title: 'Phone', showInPrimaryHeader: true, showInSecondaryHeader: true},
            { field: 'birthdate', header: 'Birthdate', title: 'Birthdate', showInPrimaryHeader: true, showInSecondaryHeader: true},
            { field: 'owner	', header: 'Owner', title: 'Owner', showInPrimaryHeader: true, showInSecondaryHeader: true},
            { field: 'qrcode', header: 'QR Code', title: 'QR Code', showInPrimaryHeader: true, showInSecondaryHeader: true},
            { field: 'status', header: 'Status', title: 'Status', showInPrimaryHeader: true, showInSecondaryHeader: true},
            { field: 'dateUpdated', header: 'Date Updated', title: 'Date Updated', showInPrimaryHeader: true, showInSecondaryHeader: false},
            { field: 'dateCreated', header: 'Date Created', title: 'Date Created', showInPrimaryHeader: true, showInSecondaryHeader: false},
            { field: 'userType', header: 'User Type', title: 'User Type', showInPrimaryHeader: true, showInSecondaryHeader: false},
            { field: 'isDigitalIdentificationActive', header: 'Digital Identification', title: 'Digital Identification', showInPrimaryHeader: true, showInSecondaryHeader: true},
            { field: 'action', header: 'Action', title: 'Action', showInPrimaryHeader: true, showInSecondaryHeader: true},
        ]

        this.getAllRegisteredUsers();
    }

    getAllRegisteredUsers(){
        const URL = `${environment.WebApiUrl + GetMethods.ADMIN_GET_ALL_REGISTERED_USERS }`;

        this._apiService.apiGetMethod(URL).subscribe({
          next: (result: ResponseData) => {
            this.payloadData = result.payload;
          },
          error: (err: any) => {
            console.log(err);
            const messageTypeErrorText = responseError(err.status);
            this._notificationService.error(messageTypeErrorText, 'bg-dark', 'animate__backInUp', 6000);
          }
        });
    }

    refreshData($event:any){
        this.getAllRegisteredUsers();
    }

}
