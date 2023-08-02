import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CorporateTransactionTableComponent } from './corporate-transaction-table.component';


describe('CorporateTransactionTableComponent', () => {
  let component: CorporateTransactionTableComponent;
  let fixture: ComponentFixture<CorporateTransactionTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CorporateTransactionTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CorporateTransactionTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
