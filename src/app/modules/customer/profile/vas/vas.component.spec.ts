import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VasComponent } from './vas.component';

describe('VasComponent', () => {
  let component: VasComponent;
  let fixture: ComponentFixture<VasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
