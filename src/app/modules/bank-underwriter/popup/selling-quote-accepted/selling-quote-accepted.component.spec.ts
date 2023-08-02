import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellingQuoteAcceptedComponent } from './selling-quote-accepted.component';

describe('SellingQuoteAcceptedComponent', () => {
  let component: SellingQuoteAcceptedComponent;
  let fixture: ComponentFixture<SellingQuoteAcceptedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SellingQuoteAcceptedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SellingQuoteAcceptedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
