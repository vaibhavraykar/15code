import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecondaryAcceptTransactionPopupComponent } from './secondary-accept-transaction-popup.component';

describe('SecondaryAcceptTransactionPopupComponent', () => {
  let component: SecondaryAcceptTransactionPopupComponent;
  let fixture: ComponentFixture<SecondaryAcceptTransactionPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SecondaryAcceptTransactionPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SecondaryAcceptTransactionPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
