import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyingActiveTransactionComponent } from './buying-active-transaction.component';

describe('BuyingActiveTransactionComponent', () => {
  let component: BuyingActiveTransactionComponent;
  let fixture: ComponentFixture<BuyingActiveTransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuyingActiveTransactionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuyingActiveTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
