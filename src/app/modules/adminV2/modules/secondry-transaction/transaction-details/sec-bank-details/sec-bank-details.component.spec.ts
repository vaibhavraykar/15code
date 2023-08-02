import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecBankDetailsComponent } from './sec-bank-details.component';

describe('SecBankDetailsComponent', () => {
  let component: SecBankDetailsComponent;
  let fixture: ComponentFixture<SecBankDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SecBankDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SecBankDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
