import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RefererKycComponent } from './referer-kyc.component';

describe('RefererKycComponent', () => {
  let component: RefererKycComponent;
  let fixture: ComponentFixture<RefererKycComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RefererKycComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RefererKycComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
