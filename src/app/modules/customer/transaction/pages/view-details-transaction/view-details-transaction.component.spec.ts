import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDetailsTransactionComponent } from './view-details-transaction.component';

describe('ViewDetailsTransactionComponent', () => {
  let component: ViewDetailsTransactionComponent;
  let fixture: ComponentFixture<ViewDetailsTransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewDetailsTransactionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewDetailsTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
