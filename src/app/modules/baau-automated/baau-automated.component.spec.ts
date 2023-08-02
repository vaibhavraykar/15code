import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaauAutomatedComponent } from './baau-automated.component';

describe('BaauAutomatedComponent', () => {
  let component: BaauAutomatedComponent;
  let fixture: ComponentFixture<BaauAutomatedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BaauAutomatedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BaauAutomatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
