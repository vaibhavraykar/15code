import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankUnderwriterQuoteAcceptedComponent } from './bank-underwriter-quote-accepted.component';

describe('BankUnderwriterQuoteAcceptedComponent', () => {
  let component: BankUnderwriterQuoteAcceptedComponent;
  let fixture: ComponentFixture<BankUnderwriterQuoteAcceptedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BankUnderwriterQuoteAcceptedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BankUnderwriterQuoteAcceptedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
