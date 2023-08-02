import { ComponentFixture, TestBed } from "@angular/core/testing";

import SecondaryApplicantBeneficiaryComponent from "./secondary-applicant-beneficiary.component";

describe("SecondaryApplicantBeneficiaryComponent", () => {
  let component: SecondaryApplicantBeneficiaryComponent;
  let fixture: ComponentFixture<SecondaryApplicantBeneficiaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SecondaryApplicantBeneficiaryComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SecondaryApplicantBeneficiaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
