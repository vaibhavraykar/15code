import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CorporateTransactionListComponent } from './corporate-transaction-list.component';


describe('CorporateTransactionListComponent', () => {
  let component: CorporateTransactionListComponent;
  let fixture: ComponentFixture<CorporateTransactionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CorporateTransactionListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CorporateTransactionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
