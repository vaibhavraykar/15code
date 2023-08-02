import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrantRequestsComponent } from './grant-requests.component';

describe('GrantRequestsComponent', () => {
  let component: GrantRequestsComponent;
  let fixture: ComponentFixture<GrantRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GrantRequestsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GrantRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
