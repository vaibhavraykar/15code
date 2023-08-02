import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CloseTransactionPopupComponent } from './close-transaction-popup.component';

describe('CloseTransactionPopupComponent', () => {
  let component: CloseTransactionPopupComponent;
  let fixture: ComponentFixture<CloseTransactionPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CloseTransactionPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CloseTransactionPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
