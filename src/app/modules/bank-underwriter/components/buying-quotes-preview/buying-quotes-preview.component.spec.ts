import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyingQuotesPreviewComponent } from './buying-quotes-preview.component';

describe('BuyingQuotesPreviewComponent', () => {
  let component: BuyingQuotesPreviewComponent;
  let fixture: ComponentFixture<BuyingQuotesPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuyingQuotesPreviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuyingQuotesPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
