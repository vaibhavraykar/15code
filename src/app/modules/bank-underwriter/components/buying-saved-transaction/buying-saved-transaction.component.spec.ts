import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyingSavedTransactionComponent } from './buying-saved-transaction.component';

describe('BuyingSavedTransactionComponent', () => {
  let component: BuyingSavedTransactionComponent;
  let fixture: ComponentFixture<BuyingSavedTransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuyingSavedTransactionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuyingSavedTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
