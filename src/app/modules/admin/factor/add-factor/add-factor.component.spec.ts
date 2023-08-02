import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFactorComponent } from './add-factor.component';

describe('AddFactorComponent', () => {
  let component: AddFactorComponent;
  let fixture: ComponentFixture<AddFactorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddFactorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddFactorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
