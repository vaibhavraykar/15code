import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RefererListComponent } from './referer-list.component';

describe('RefererListComponent', () => {
  let component: RefererListComponent;
  let fixture: ComponentFixture<RefererListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RefererListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RefererListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
