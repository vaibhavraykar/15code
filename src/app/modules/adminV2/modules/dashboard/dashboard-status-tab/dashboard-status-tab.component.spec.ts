import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardStatusTabComponent } from './dashboard-status-tab.component';

describe('DashboardStatusTabComponent', () => {
  let component: DashboardStatusTabComponent;
  let fixture: ComponentFixture<DashboardStatusTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardStatusTabComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardStatusTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
