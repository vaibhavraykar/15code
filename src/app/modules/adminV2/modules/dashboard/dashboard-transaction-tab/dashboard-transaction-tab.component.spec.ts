import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardTransactionTabComponent } from './dashboard-transaction-tab.component';

describe('DashboardTransactionTabComponent', () => {
  let component: DashboardTransactionTabComponent;
  let fixture: ComponentFixture<DashboardTransactionTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardTransactionTabComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardTransactionTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
