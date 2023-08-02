import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSecondaryTransactionComponent } from './new-secondary-transaction.component';

describe('NewSecondaryTransactionComponent', () => {
  let component: NewSecondaryTransactionComponent;
  let fixture: ComponentFixture<NewSecondaryTransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewSecondaryTransactionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewSecondaryTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
