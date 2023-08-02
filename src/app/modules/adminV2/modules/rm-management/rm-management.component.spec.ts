import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RmManagementComponent } from './rm-management.component';

describe('RmManagementComponent', () => {
  let component: RmManagementComponent;
  let fixture: ComponentFixture<RmManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RmManagementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RmManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
