import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CountryFlag } from '@methods/countrycode';
import { PutMethods } from '@methods/methods';
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
    countryFlag: any = CountryFlag;

    @Input() payloadData: any;
    @Input() primaryId: any;
    @Input() secondaryId: any;
    @Output() getProfileUpdated = new EventEmitter<any>();
    genderType: any = [];


    constructor( private _apiService: ApiService, private _notificationService: NotificationService, private _formBuilder: FormBuilder) {}

    ngOnInit(): void {
        this.genderType = [
            { Id: 1, gender: 'Macho' },
            { Id: 2, gender: 'Hembra' }
        ];
    }

    get f() { return this.profileForm.controls; }

    onSubmit(){
        const data = {
            ownerPetName: this.f.ownerPetName.value,
            genderSelected: this.f.genderSelected.value,
            petName: this.f.petName.value,
            race: this.f.race.value,
            weight: this.f.weight.value,
            phone: this.f.phone.value,
            country: this.f.country.value, 
            birthDate: this.f.birthDate.value,
            veterinarianContact: this.f.veterinarianContact.value,
            phoneVeterinarian: this.f.phoneVeterinarian.value,
            favoriteActivities: this.f.favoriteActivities.value,
            healthAndRequirements: this.f.healthAndRequirements.value,
            address: this.f.address.value,
            _id: this.primaryId,
            idSecond: this.secondaryId
        }
        const URL = `${environment.WebApiUrl + PutMethods.USER_UPDATE_SECONDARY_PROFILE }`;
        this._apiService.apiPutMethod(URL, data).subscribe({
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

    onChangeCountry(country:any){ 
        this.profileForm.get('country')?.setValue(country.value);
    }
}
