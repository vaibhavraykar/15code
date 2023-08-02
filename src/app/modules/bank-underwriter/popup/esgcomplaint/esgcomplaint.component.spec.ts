import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EsgcomplaintComponent } from './esgcomplaint.component';

describe('EsgcomplaintComponent', () => {
  let component: EsgcomplaintComponent;
  let fixture: ComponentFixture<EsgcomplaintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EsgcomplaintComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EsgcomplaintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
