import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyPetCodeComponent } from './my-pet-code.component';

describe('MyPetCodeComponent', () => {
  let component: MyPetCodeComponent;
  let fixture: ComponentFixture<MyPetCodeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MyPetCodeComponent]
    });
    fixture = TestBed.createComponent(MyPetCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
