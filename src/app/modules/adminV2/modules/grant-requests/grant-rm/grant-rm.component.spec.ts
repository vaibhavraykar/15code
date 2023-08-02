import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrantRmComponent } from './grant-rm.component';

describe('GrantRmComponent', () => {
  let component: GrantRmComponent;
  let fixture: ComponentFixture<GrantRmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GrantRmComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GrantRmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
