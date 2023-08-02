import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankQuoteAcceptedComponent } from './bank-quote-accepted.component';

describe('BankQuoteAcceptedComponent', () => {
  let component: BankQuoteAcceptedComponent;
  let fixture: ComponentFixture<BankQuoteAcceptedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BankQuoteAcceptedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BankQuoteAcceptedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
