import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTransListComponent } from './view-trans-list.component';

describe('ViewTransListComponent', () => {
  let component: ViewTransListComponent;
  let fixture: ComponentFixture<ViewTransListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewTransListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewTransListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
