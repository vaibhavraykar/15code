import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankQuotePopupComponent } from './bank-quote-popup.component';

describe('BankQuotePopupComponent', () => {
  let component: BankQuotePopupComponent;
  let fixture: ComponentFixture<BankQuotePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BankQuotePopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BankQuotePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
