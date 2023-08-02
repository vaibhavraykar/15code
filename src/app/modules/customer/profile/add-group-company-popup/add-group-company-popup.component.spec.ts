import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddGroupCompanyPopupComponent } from './add-group-company-popup.component';

describe('AddGroupCompanyPopupComponent', () => {
  let component: AddGroupCompanyPopupComponent;
  let fixture: ComponentFixture<AddGroupCompanyPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddGroupCompanyPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddGroupCompanyPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
