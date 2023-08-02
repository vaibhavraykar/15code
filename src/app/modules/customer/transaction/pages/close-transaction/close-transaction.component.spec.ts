import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CloseTransactionComponent } from './close-transaction.component';

describe('CloseTransactionComponent', () => {
  let component: CloseTransactionComponent;
  let fixture: ComponentFixture<CloseTransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CloseTransactionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CloseTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
