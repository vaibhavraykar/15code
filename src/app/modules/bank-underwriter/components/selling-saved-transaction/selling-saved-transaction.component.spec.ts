import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellingSavedTransactionComponent } from './selling-saved-transaction.component';

describe('SellingSavedTransactionComponent', () => {
  let component: SellingSavedTransactionComponent;
  let fixture: ComponentFixture<SellingSavedTransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SellingSavedTransactionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SellingSavedTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
