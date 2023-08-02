import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerSendOtpComponent } from './customer-send-otp.component';

describe('CustomerSendOtpComponent', () => {
  let component: CustomerSendOtpComponent;
  let fixture: ComponentFixture<CustomerSendOtpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerSendOtpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerSendOtpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
