import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgetPassPopupComponent } from './forget-pass-popup.component';

describe('ForgetPassPopupComponent', () => {
  let component: ForgetPassPopupComponent;
  let fixture: ComponentFixture<ForgetPassPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ForgetPassPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ForgetPassPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
