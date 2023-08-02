import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveTransactionComponent } from './save-transaction.component';

describe('SaveTransactionComponent', () => {
  let component: SaveTransactionComponent;
  let fixture: ComponentFixture<SaveTransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaveTransactionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaveTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
