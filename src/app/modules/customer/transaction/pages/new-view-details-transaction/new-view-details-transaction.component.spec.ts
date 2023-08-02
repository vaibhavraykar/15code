import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewViewDetailsTransactionComponent } from './new-view-details-transaction.component';

describe('NewViewDetailsTransactionComponent', () => {
  let component: NewViewDetailsTransactionComponent;
  let fixture: ComponentFixture<NewViewDetailsTransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewViewDetailsTransactionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewViewDetailsTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
