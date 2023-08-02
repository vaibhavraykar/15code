import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecondaryTransactionDetailsComponent } from './secondary-transaction-details.component';

describe('SecondaryTransactionDetailsComponent', () => {
  let component: SecondaryTransactionDetailsComponent;
  let fixture: ComponentFixture<SecondaryTransactionDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SecondaryTransactionDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SecondaryTransactionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
