import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDetailsRefComponent } from './view-details-ref.component';

describe('ViewDetailsRefComponent', () => {
  let component: ViewDetailsRefComponent;
  let fixture: ComponentFixture<ViewDetailsRefComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewDetailsRefComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewDetailsRefComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
