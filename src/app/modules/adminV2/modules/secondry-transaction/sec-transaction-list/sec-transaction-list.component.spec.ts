import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecTransactionListComponent } from './sec-transaction-list.component';

describe('SecTransactionListComponent', () => {
  let component: SecTransactionListComponent;
  let fixture: ComponentFixture<SecTransactionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SecTransactionListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SecTransactionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
