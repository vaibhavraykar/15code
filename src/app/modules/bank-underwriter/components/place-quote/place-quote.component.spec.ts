import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaceQuoteComponent } from './place-quote.component';

describe('PlaceQuoteComponent', () => {
  let component: PlaceQuoteComponent;
  let fixture: ComponentFixture<PlaceQuoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlaceQuoteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlaceQuoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
