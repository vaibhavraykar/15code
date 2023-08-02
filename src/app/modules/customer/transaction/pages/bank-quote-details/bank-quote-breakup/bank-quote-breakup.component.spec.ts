import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankQuoteBreakupComponent } from './bank-quote-breakup.component';

describe('BankQuoteBreakupComponent', () => {
  let component: BankQuoteBreakupComponent;
  let fixture: ComponentFixture<BankQuoteBreakupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BankQuoteBreakupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BankQuoteBreakupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
