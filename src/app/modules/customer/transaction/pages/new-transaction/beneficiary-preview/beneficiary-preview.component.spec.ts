import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BeneficiaryPreviewComponent } from './beneficiary-preview.component';

describe('BeneficiaryPreviewComponent', () => {
  let component: BeneficiaryPreviewComponent;
  let fixture: ComponentFixture<BeneficiaryPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BeneficiaryPreviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BeneficiaryPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
