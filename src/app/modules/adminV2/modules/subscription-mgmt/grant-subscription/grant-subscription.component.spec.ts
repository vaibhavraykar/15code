import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrantSubscriptionComponent } from './grant-subscription.component';

describe('GrantSubscriptionComponent', () => {
  let component: GrantSubscriptionComponent;
  let fixture: ComponentFixture<GrantSubscriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GrantSubscriptionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GrantSubscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
