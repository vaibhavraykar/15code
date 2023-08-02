import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcceptRejectUserComponent } from './accept-reject-user.component';

describe('AcceptRejectUserComponent', () => {
  let component: AcceptRejectUserComponent;
  let fixture: ComponentFixture<AcceptRejectUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AcceptRejectUserComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcceptRejectUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
