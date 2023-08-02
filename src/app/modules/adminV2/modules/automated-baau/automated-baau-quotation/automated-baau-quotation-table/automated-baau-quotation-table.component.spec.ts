import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AutomatedBaauQuotationTableComponent } from './automated-baau-quotation-table.component';


describe('AutomatedBaauQuotationTableComponent', () => {
  let component: AutomatedBaauQuotationTableComponent;
  let fixture: ComponentFixture<AutomatedBaauQuotationTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AutomatedBaauQuotationTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AutomatedBaauQuotationTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
