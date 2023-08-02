import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChipsDropdownComponent } from './chips-dropdown.component';

describe('ChipsDropdownComponent', () => {
  let component: ChipsDropdownComponent;
  let fixture: ComponentFixture<ChipsDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChipsDropdownComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChipsDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
