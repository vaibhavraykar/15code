import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscountMgmtComponent } from './discount-mgmt.component';

describe('DiscountMgmtComponent', () => {
  let component: DiscountMgmtComponent;
  let fixture: ComponentFixture<DiscountMgmtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiscountMgmtComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiscountMgmtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
