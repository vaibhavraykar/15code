import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostpaidTransactionSuccessComponent } from './postpaid-transaction-success.component';

describe('PostpaidTransactionSuccessComponent', () => {
  let component: PostpaidTransactionSuccessComponent;
  let fixture: ComponentFixture<PostpaidTransactionSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostpaidTransactionSuccessComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostpaidTransactionSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
