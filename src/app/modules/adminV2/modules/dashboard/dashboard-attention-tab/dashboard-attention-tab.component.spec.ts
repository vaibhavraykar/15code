import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardAttentionTabComponent } from './dashboard-attention-tab.component';

describe('DashboardAttentionTabComponent', () => {
  let component: DashboardAttentionTabComponent;
  let fixture: ComponentFixture<DashboardAttentionTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardAttentionTabComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardAttentionTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
