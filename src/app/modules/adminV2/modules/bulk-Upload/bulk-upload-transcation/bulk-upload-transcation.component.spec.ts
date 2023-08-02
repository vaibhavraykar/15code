import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkUploadTranscationComponent } from './bulk-upload-transcation.component';

describe('BulkUploadTranscationComponent', () => {
  let component: BulkUploadTranscationComponent;
  let fixture: ComponentFixture<BulkUploadTranscationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BulkUploadTranscationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BulkUploadTranscationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
