import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBankDetailsPopupComponent } from './add-bank-details-popup.component';

describe('AddBankDetailsPopupComponent', () => {
  let component: AddBankDetailsPopupComponent;
  let fixture: ComponentFixture<AddBankDetailsPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddBankDetailsPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddBankDetailsPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
