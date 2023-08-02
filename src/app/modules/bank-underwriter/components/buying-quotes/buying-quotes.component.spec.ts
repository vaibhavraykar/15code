import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyingQuotesComponent } from './buying-quotes.component';

describe('BuyingQuotesComponent', () => {
  let component: BuyingQuotesComponent;
  let fixture: ComponentFixture<BuyingQuotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuyingQuotesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuyingQuotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
