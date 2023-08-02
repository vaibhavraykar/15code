import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotesNotAcceptedComponent } from './quotes-not-accepted.component';

describe('QuotesNotAcceptedComponent', () => {
  let component: QuotesNotAcceptedComponent;
  let fixture: ComponentFixture<QuotesNotAcceptedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuotesNotAcceptedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuotesNotAcceptedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
