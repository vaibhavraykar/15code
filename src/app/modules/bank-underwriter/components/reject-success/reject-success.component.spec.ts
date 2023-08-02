import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectSuccessComponent } from './reject-success.component';

describe('RejectSuccessComponent', () => {
  let component: RejectSuccessComponent;
  let fixture: ComponentFixture<RejectSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RejectSuccessComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RejectSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
