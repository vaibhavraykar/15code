import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewCouponComponent } from './new-coupon.component';

describe('NewCouponComponent', () => {
  let component: NewCouponComponent;
  let fixture: ComponentFixture<NewCouponComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewCouponComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewCouponComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
