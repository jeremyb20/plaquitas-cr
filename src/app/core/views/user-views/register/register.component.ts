import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html'
})
export class RegisterComponent implements OnInit {

    primaryId: string;
    secondaryId: string;
    isActivated: boolean;
    formValidateInputs: any;
    formShowInputs: any;
    registerType: number;

    constructor(private route: ActivatedRoute ){
       
        this.route.queryParams.subscribe(params => {
            this.primaryId = params.id;
            this.secondaryId = params.idSecond;
            this.isActivated = params.isActivated === 'true' ?  true : false;
        });
    }

    ngOnInit(): void {
        this.formValidateInputs = [
            { control: 'genderSelected', show: true},
            { control: 'petName', show: true },
            { control: 'phone', show: true },
            { control: 'codeGenerator', show: this.isActivated },
            { control: 'email', show: true },
            { control: 'password', show: true },
            { control: 'confirmPassword', show: true},
            { control: 'acceptTerms', show: true },
        ]

        this.formShowInputs = {
            showGenderSelected: true,
            showPetName: true,
            showPhone: true,
            showCodeGenerator: this.isActivated,
            showEmail: true,
            showPassword: true,
            showConfirmPassword: true,
            showAcceptTerms: true
        }

        this.registerType = this.isActivated ? 2 : 0;
    }
}
