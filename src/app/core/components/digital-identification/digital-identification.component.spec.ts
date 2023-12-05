import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DigitalIdentificationComponent } from './digital-identification.component';

describe('DigitalIdentificationComponent', () => {
  let component: DigitalIdentificationComponent;
  let fixture: ComponentFixture<DigitalIdentificationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DigitalIdentificationComponent]
    });
    fixture = TestBed.createComponent(DigitalIdentificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
