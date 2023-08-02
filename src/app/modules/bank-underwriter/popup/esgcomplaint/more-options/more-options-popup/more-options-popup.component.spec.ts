import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoreOptionsPopupComponent } from './more-options-popup.component';

describe('MoreOptionsPopupComponent', () => {
  let component: MoreOptionsPopupComponent;
  let fixture: ComponentFixture<MoreOptionsPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MoreOptionsPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MoreOptionsPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
