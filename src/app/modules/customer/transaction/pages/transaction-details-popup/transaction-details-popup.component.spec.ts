import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionDetailsPopupComponent } from './transaction-details-popup.component';

describe('TransactionDetailsPopupComponent', () => {
  let component: TransactionDetailsPopupComponent;
  let fixture: ComponentFixture<TransactionDetailsPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransactionDetailsPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransactionDetailsPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
