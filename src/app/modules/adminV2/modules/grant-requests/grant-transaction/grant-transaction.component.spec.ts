import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrantTransactionComponent } from './grant-transaction.component';

describe('GrantTransactionComponent', () => {
  let component: GrantTransactionComponent;
  let fixture: ComponentFixture<GrantTransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GrantTransactionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GrantTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
