import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionInfoPopupComponent } from './transaction-info-popup.component';

describe('TransactionInfoPopupComponent', () => {
  let component: TransactionInfoPopupComponent;
  let fixture: ComponentFixture<TransactionInfoPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransactionInfoPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransactionInfoPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
