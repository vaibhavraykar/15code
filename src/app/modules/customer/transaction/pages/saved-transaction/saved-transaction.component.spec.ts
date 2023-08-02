import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavedTransactionComponent } from './saved-transaction.component';

describe('SavedTransactionComponent', () => {
  let component: SavedTransactionComponent;
  let fixture: ComponentFixture<SavedTransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SavedTransactionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SavedTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
