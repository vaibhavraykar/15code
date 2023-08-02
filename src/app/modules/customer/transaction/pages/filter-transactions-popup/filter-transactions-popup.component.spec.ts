import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterTransactionsPopupComponent } from './filter-transactions-popup.component';

describe('FilterTransactionsPopupComponent', () => {
  let component: FilterTransactionsPopupComponent;
  let fixture: ComponentFixture<FilterTransactionsPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilterTransactionsPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilterTransactionsPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
