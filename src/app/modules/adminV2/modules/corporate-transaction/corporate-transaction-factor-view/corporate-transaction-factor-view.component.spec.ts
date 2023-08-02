import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CorporateTransactionFactorViewComponent } from './corporate-transaction-factor-view.component';


describe('CorporateTransactionFactorViewComponent', () => {
  let component: CorporateTransactionFactorViewComponent;
  let fixture: ComponentFixture<CorporateTransactionFactorViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CorporateTransactionFactorViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CorporateTransactionFactorViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
