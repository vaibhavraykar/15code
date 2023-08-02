import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecQuotationListComponent } from './sec-quotation-list.component';

describe('SecQuotationListComponent', () => {
  let component: SecQuotationListComponent;
  let fixture: ComponentFixture<SecQuotationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SecQuotationListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SecQuotationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
