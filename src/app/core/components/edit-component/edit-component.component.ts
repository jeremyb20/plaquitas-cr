import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UpdateMethods } from '@methods/methods';
import { ResponseData } from '@models/models';
import { ApiService } from '@services/api.service';
import { NotificationService } from '@services/notification.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-edit-component',
  templateUrl: './edit-component.component.html'
})
export class EditComponentComponent implements OnInit {
    @Input() profileForm: FormGroup;
    submitted: boolean = false;
    loading: boolean = false;

    @Input() payloadData: any;
    @Input() primaryId: any;
    @Input() secondaryId: any;
    @Output() getProfileUpdated = new EventEmitter<any>();

    constructor( private _apiService: ApiService, private _notificationService: NotificationService, private _formBuilder: FormBuilder) {}

    ngOnInit(): void {

    }

    get f() { return this.profileForm.controls; }

    onSubmit(){
        const data = {
            ownerPetName: this.f.ownerPetName.value,
            petName: this.f.petName.value,
            phone: this.f.phone.value,
            birthDate: this.f.birthDate.value,
            veterinarianContact: this.f.veterinarianContact.value,
            phoneVeterinarian: this.f.phoneVeterinarian.value,
            favoriteActivities: this.f.favoriteActivities.value,
            healthAndRequirements: this.f.healthAndRequirements.value,
            address: this.f.address.value,
            _id: this.primaryId,
            idSecond: this.secondaryId
        }
        const URL = `${environment.WebApiUrl + UpdateMethods.USER_UPDATE_SECONDARY_PROFILE }`;
        this._apiService.apiUpdateMethod(URL, data).subscribe({
            next: (result: ResponseData) => {
                if(result.success){
                    this.getProfileUpdated.emit(data);
                    this._notificationService.success(result.msg, 'bg-success', 'animate__backInUp', 6000);
                }else{
                    this._notificationService.warning(result.msg, 'bg-dark', 'animate__backInUp', 6000);
                }
            },
            error: (err: any) => {
                console.log(err);
                this._notificationService.warning('An error occurred in the process.', 'bg-dark', 'animate__backInUp', 6000);
            }
        });
    }

}
