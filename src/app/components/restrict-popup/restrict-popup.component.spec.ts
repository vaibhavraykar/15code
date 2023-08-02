import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestrictPopupComponent } from './restrict-popup.component';

describe('RestrictPopupComponent', () => {
  let component: RestrictPopupComponent;
  let fixture: ComponentFixture<RestrictPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RestrictPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RestrictPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
