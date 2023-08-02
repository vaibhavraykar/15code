import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewRefererComponent } from './view-referer.component';

describe('ViewRefererComponent', () => {
  let component: ViewRefererComponent;
  let fixture: ComponentFixture<ViewRefererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewRefererComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewRefererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
