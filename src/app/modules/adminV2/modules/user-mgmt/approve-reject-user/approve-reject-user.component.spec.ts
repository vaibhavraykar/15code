import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveRejectUser } from './approve-reject-user.component';

describe('ApproveRejectUser', () => {
  let component: ApproveRejectUser;
  let fixture: ComponentFixture<ApproveRejectUser>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApproveRejectUser ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApproveRejectUser);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
