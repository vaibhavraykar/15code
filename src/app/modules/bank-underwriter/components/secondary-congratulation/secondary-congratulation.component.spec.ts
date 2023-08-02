import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecondaryCongratulationComponent } from './secondary-congratulation.component';

describe('SecondaryCongratulationComponent', () => {
  let component: SecondaryCongratulationComponent;
  let fixture: ComponentFixture<SecondaryCongratulationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SecondaryCongratulationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SecondaryCongratulationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
