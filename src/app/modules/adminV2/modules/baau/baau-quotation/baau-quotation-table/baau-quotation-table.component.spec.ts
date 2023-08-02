import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BaauQuotationTableComponent } from './baau-quotation-table.component';


describe('BaauQuotationTableComponent', () => {
  let component: BaauQuotationTableComponent;
  let fixture: ComponentFixture<BaauQuotationTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BaauQuotationTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BaauQuotationTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
