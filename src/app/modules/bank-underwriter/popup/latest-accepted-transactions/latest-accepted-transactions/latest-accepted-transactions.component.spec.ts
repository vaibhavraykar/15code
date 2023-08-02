import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LatestAcceptedTransactionsComponent } from './latest-accepted-transactions.component';

describe('LatestAcceptedTransactionsComponent', () => {
  let component: LatestAcceptedTransactionsComponent;
  let fixture: ComponentFixture<LatestAcceptedTransactionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LatestAcceptedTransactionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LatestAcceptedTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
