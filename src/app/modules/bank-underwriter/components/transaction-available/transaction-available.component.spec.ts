import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionAvailableComponent } from './transaction-available.component';

describe('TransactionAvailableComponent', () => {
  let component: TransactionAvailableComponent;
  let fixture: ComponentFixture<TransactionAvailableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransactionAvailableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransactionAvailableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
