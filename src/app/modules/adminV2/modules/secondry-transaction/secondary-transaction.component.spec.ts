import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecondaryTransactionComponent } from './secondary-transaction.component';

describe('SecondaryTransactionComponent', () => {
  let component: SecondaryTransactionComponent;
  let fixture: ComponentFixture<SecondaryTransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SecondaryTransactionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SecondaryTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
