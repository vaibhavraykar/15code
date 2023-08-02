import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcceptRejectCouponsComponent } from './accept-reject-coupons.component';

describe('AcceptRejectCouponsComponent', () => {
  let component: AcceptRejectCouponsComponent;
  let fixture: ComponentFixture<AcceptRejectCouponsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AcceptRejectCouponsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcceptRejectCouponsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
