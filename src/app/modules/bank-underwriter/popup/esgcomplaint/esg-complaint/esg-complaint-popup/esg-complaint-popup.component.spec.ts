import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EsgComplaintPopupComponent } from './esg-complaint-popup.component';

describe('EsgComplaintPopupComponent', () => {
  let component: EsgComplaintPopupComponent;
  let fixture: ComponentFixture<EsgComplaintPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EsgComplaintPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EsgComplaintPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
