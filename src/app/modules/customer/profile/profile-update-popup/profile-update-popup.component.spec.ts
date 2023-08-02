import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileUpdatePopupComponent } from './profile-update-popup.component';

describe('ProfileUpdatePopupComponent', () => {
  let component: ProfileUpdatePopupComponent;
  let fixture: ComponentFixture<ProfileUpdatePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfileUpdatePopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileUpdatePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
