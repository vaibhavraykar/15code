import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuoatationListComponent } from './quoatation-list.component';

describe('QuoatationListComponent', () => {
  let component: QuoatationListComponent;
  let fixture: ComponentFixture<QuoatationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuoatationListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuoatationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
