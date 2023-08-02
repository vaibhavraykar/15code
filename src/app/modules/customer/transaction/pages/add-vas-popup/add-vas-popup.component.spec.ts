import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddVasPopupComponent } from './add-vas-popup.component';

describe('AddVasPopupComponent', () => {
  let component: AddVasPopupComponent;
  let fixture: ComponentFixture<AddVasPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddVasPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddVasPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
