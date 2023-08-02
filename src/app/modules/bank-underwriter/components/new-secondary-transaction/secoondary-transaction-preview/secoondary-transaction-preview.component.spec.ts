import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecoondaryTransactionPreviewComponent } from './secoondary-transaction-preview.component';

describe('SecoondaryTransactionPreviewComponent', () => {
  let component: SecoondaryTransactionPreviewComponent;
  let fixture: ComponentFixture<SecoondaryTransactionPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SecoondaryTransactionPreviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SecoondaryTransactionPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
