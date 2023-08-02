import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellingTransactionDetailsComponent } from './selling-transaction-details.component';

describe('SellingTransactionDetailsComponent', () => {
  let component: SellingTransactionDetailsComponent;
  let fixture: ComponentFixture<SellingTransactionDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SellingTransactionDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SellingTransactionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
