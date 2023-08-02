import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardUsersTabComponent } from './dashboard-users-tab.component';

describe('DashboardUsersTabComponent', () => {
  let component: DashboardUsersTabComponent;
  let fixture: ComponentFixture<DashboardUsersTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardUsersTabComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardUsersTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
