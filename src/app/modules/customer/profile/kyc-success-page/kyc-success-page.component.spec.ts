import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KycSuccessPageComponent } from './kyc-success-page.component';

describe('KycSuccessPageComponent', () => {
  let component: KycSuccessPageComponent;
  let fixture: ComponentFixture<KycSuccessPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KycSuccessPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KycSuccessPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
