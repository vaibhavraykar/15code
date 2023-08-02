import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecondaryPricingComponent } from './secondary-pricing.component';

describe('SecondaryPricingComponent', () => {
  let component: SecondaryPricingComponent;
  let fixture: ComponentFixture<SecondaryPricingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SecondaryPricingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SecondaryPricingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
