import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecondryTransactionDetailsComponent } from './secondry-transaction-details.component';

describe('SecondryTransactionDetailsComponent', () => {
  let component: SecondryTransactionDetailsComponent;
  let fixture: ComponentFixture<SecondryTransactionDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SecondryTransactionDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SecondryTransactionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
