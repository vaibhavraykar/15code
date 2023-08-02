import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicantBeneficiaryComponent } from './applicant-beneficiary.component';

describe('ApplicantBeneficiaryComponent', () => {
  let component: ApplicantBeneficiaryComponent;
  let fixture: ComponentFixture<ApplicantBeneficiaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplicantBeneficiaryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApplicantBeneficiaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
