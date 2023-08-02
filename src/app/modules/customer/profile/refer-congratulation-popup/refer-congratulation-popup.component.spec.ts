import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferCongratulationPopupComponent } from './refer-congratulation-popup.component';

describe('ReferCongratulationPopupComponent', () => {
  let component: ReferCongratulationPopupComponent;
  let fixture: ComponentFixture<ReferCongratulationPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReferCongratulationPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReferCongratulationPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
