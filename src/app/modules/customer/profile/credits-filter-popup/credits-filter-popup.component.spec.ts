import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditsFilterPopupComponent } from './credits-filter-popup.component';

describe('CreditsFilterPopupComponent', () => {
  let component: CreditsFilterPopupComponent;
  let fixture: ComponentFixture<CreditsFilterPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreditsFilterPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreditsFilterPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
