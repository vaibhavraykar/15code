import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardRevenueTabComponent } from './dashboard-revenue-tab.component';

describe('DashboardRevenueTabComponent', () => {
  let component: DashboardRevenueTabComponent;
  let fixture: ComponentFixture<DashboardRevenueTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardRevenueTabComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardRevenueTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
