import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecondaryCloseTransactionPopupComponent } from './secondary-close-transaction-popup.component';

describe('SecondaryCloseTransactionPopupComponent', () => {
  let component: SecondaryCloseTransactionPopupComponent;
  let fixture: ComponentFixture<SecondaryCloseTransactionPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SecondaryCloseTransactionPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SecondaryCloseTransactionPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
