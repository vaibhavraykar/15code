import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferPopupComponent } from './refer-popup.component';

describe('ReferPopupComponent', () => {
  let component: ReferPopupComponent;
  let fixture: ComponentFixture<ReferPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReferPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReferPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
