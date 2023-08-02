import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyingQuotationUpdatePopupComponent } from './buying-quotation-update-popup.component';

describe('BuyingQuotationUpdatePopupComponent', () => {
  let component: BuyingQuotationUpdatePopupComponent;
  let fixture: ComponentFixture<BuyingQuotationUpdatePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuyingQuotationUpdatePopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuyingQuotationUpdatePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
