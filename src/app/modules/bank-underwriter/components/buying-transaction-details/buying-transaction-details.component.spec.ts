import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyingTransactionDetailsComponent } from './buying-transaction-details.component';

describe('BuyingTransactionDetailsComponent', () => {
  let component: BuyingTransactionDetailsComponent;
  let fixture: ComponentFixture<BuyingTransactionDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuyingTransactionDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuyingTransactionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
