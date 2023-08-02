import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrantPaymentComponent } from './grant-payment.component';

describe('GrantPaymentComponent', () => {
  let component: GrantPaymentComponent;
  let fixture: ComponentFixture<GrantPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GrantPaymentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GrantPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
