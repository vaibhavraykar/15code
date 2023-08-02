import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyingTransactionDetailComponent } from './buying-transaction-detail.component';

describe('BuyingTransactionDetailComponent', () => {
  let component: BuyingTransactionDetailComponent;
  let fixture: ComponentFixture<BuyingTransactionDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuyingTransactionDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuyingTransactionDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
