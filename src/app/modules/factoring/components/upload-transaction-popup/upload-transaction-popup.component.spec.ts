import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadTransactionPopupComponent } from './upload-transaction-popup.component';

describe('UploadTransactionPopupComponent', () => {
  let component: UploadTransactionPopupComponent;
  let fixture: ComponentFixture<UploadTransactionPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadTransactionPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadTransactionPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
