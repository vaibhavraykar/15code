import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostpaidTransactionPopupComponent } from './postpaid-transaction-popup.component';

describe('PostpaidTransactionPopupComponent', () => {
  let component: PostpaidTransactionPopupComponent;
  let fixture: ComponentFixture<PostpaidTransactionPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostpaidTransactionPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostpaidTransactionPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
