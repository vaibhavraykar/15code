import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellingActiveTransactionComponent } from './selling-active-transaction.component';

describe('SellingActiveTransactionComponent', () => {
  let component: SellingActiveTransactionComponent;
  let fixture: ComponentFixture<SellingActiveTransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SellingActiveTransactionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SellingActiveTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
