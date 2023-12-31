import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveTransactionComponent } from './active-transaction.component';

describe('ActiveTransactionComponent', () => {
  let component: ActiveTransactionComponent;
  let fixture: ComponentFixture<ActiveTransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActiveTransactionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActiveTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
