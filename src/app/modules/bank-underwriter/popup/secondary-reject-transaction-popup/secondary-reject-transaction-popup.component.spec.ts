import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecondaryRejectTransactionPopupComponent } from './secondary-reject-transaction-popup.component';

describe('SecondaryRejectTransactionPopupComponent', () => {
  let component: SecondaryRejectTransactionPopupComponent;
  let fixture: ComponentFixture<SecondaryRejectTransactionPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SecondaryRejectTransactionPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SecondaryRejectTransactionPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
