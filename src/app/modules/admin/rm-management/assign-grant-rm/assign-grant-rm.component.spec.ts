import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignGrantRmComponent } from './assign-grant-rm.component';

describe('AssignGrantRmComponent', () => {
  let component: AssignGrantRmComponent;
  let fixture: ComponentFixture<AssignGrantRmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignGrantRmComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignGrantRmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
