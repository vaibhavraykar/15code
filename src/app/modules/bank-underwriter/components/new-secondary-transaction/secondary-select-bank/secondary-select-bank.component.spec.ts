import { ComponentFixture, TestBed } from '@angular/core/testing';

import SecondarySelectBankComponent from './secondary-select-bank.component';

describe('SecondarySelectBankComponent', () => {
  let component: SecondarySelectBankComponent;
  let fixture: ComponentFixture<SecondarySelectBankComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SecondarySelectBankComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SecondarySelectBankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
