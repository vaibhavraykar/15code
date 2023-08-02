import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankQuoteDetailsComponent } from './bank-quote-details.component';

describe('BankQuoteDetailsComponent', () => {
  let component: BankQuoteDetailsComponent;
  let fixture: ComponentFixture<BankQuoteDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BankQuoteDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BankQuoteDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
