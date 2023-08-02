import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionMgmtComponent } from './subscription-mgmt.component';

describe('SubscriptionMgmtComponent', () => {
  let component: SubscriptionMgmtComponent;
  let fixture: ComponentFixture<SubscriptionMgmtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubscriptionMgmtComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubscriptionMgmtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
