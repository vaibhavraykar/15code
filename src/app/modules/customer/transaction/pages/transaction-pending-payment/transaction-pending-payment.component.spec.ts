import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionPendingPaymentComponent } from './transaction-pending-payment.component';

describe('TransactionPendingPaymentComponent', () => {
  let component: TransactionPendingPaymentComponent;
  let fixture: ComponentFixture<TransactionPendingPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransactionPendingPaymentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransactionPendingPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
