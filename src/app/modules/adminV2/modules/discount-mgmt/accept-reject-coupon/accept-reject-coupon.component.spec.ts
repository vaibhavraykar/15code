import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcceptRejectCouponComponent } from './accept-reject-coupon.component';

describe('AcceptRejectCouponComponent', () => {
  let component: AcceptRejectCouponComponent;
  let fixture: ComponentFixture<AcceptRejectCouponComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AcceptRejectCouponComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcceptRejectCouponComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
