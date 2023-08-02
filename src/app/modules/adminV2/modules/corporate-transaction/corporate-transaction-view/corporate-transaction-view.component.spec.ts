import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CorporateTransactionViewComponent } from './corporate-transaction-view.component';


describe('CorporateTransactionViewComponent', () => {
  let component: CorporateTransactionViewComponent;
  let fixture: ComponentFixture<CorporateTransactionViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CorporateTransactionViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CorporateTransactionViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
