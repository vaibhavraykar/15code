import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecondaryTransactionPreviewComponent } from './secondary-transaction-preview.component';

describe('SecondaryTransactionPreviewComponent', () => {
  let component: SecondaryTransactionPreviewComponent;
  let fixture: ComponentFixture<SecondaryTransactionPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SecondaryTransactionPreviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SecondaryTransactionPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
