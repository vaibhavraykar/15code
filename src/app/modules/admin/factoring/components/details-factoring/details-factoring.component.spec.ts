import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsFactoringComponent } from './details-factoring.component';

describe('DetailsFactoringComponent', () => {
  let component: DetailsFactoringComponent;
  let fixture: ComponentFixture<DetailsFactoringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailsFactoringComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailsFactoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
