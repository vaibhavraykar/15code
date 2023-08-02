import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionDetailsListComponent } from './transaction-details-list.component';

describe('TransactionDetailsListComponent', () => {
  let component: TransactionDetailsListComponent;
  let fixture: ComponentFixture<TransactionDetailsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransactionDetailsListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransactionDetailsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
