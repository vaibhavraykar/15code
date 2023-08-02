import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitBankDetailsComponent } from './submit-bank-details.component';

describe('SubmitBankDetailsComponent', () => {
  let component: SubmitBankDetailsComponent;
  let fixture: ComponentFixture<SubmitBankDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubmitBankDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubmitBankDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
