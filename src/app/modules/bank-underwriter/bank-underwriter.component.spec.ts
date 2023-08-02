import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankUnderwriterComponent } from './bank-underwriter.component';

describe('BankUnderwriterComponent', () => {
  let component: BankUnderwriterComponent;
  let fixture: ComponentFixture<BankUnderwriterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BankUnderwriterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BankUnderwriterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
