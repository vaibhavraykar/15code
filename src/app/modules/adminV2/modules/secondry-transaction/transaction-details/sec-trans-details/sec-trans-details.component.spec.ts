import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecTransDetailsComponent } from './sec-trans-details.component';

describe('SecTransDetailsComponent', () => {
  let component: SecTransDetailsComponent;
  let fixture: ComponentFixture<SecTransDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SecTransDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SecTransDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
