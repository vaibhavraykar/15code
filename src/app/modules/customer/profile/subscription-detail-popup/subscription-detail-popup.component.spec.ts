import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionDetailPopupComponent } from './subscription-detail-popup.component';

describe('SubscriptionDetailPopupComponent', () => {
  let component: SubscriptionDetailPopupComponent;
  let fixture: ComponentFixture<SubscriptionDetailPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubscriptionDetailPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubscriptionDetailPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
