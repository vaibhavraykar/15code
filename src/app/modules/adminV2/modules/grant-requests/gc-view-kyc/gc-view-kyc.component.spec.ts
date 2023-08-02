import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GCViewKycComponent } from './gc-view-kyc.component';


describe('GCViewKycComponent', () => {
  let component: GCViewKycComponent;
  let fixture: ComponentFixture<GCViewKycComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GCViewKycComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GCViewKycComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
