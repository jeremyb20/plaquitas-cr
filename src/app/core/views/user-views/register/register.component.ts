import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MustMatch } from '@methods/methods';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html'
})
export class RegisterComponent implements OnInit {

    primaryId: string;
    secondaryId: string;
    isActivated: boolean;

    formIdType: number;

    constructor(private route: ActivatedRoute ,private formBuilder: FormBuilder,){
       
        this.route.queryParams.subscribe(params => {
            this.primaryId = params.id;
            this.secondaryId = params.idSecond;
            this.isActivated = params.isActivated === 'true' ?  true : false;
        });
    }

    ngOnInit(): void {
        this.formIdType = this.isActivated ? 1 : 0;
    }
}
