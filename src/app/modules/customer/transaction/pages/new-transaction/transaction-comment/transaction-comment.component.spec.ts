import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionCommentComponent } from './transaction-comment.component';

describe('TransactionCommentComponent', () => {
  let component: TransactionCommentComponent;
  let fixture: ComponentFixture<TransactionCommentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransactionCommentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransactionCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
