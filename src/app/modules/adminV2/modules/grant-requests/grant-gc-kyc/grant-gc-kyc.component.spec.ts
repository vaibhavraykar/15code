import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GrantGCKycComponent } from './grant-gc-kyc.component';


describe('GrantGCKycComponent', () => {
  let component: GrantGCKycComponent;
  let fixture: ComponentFixture<GrantGCKycComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GrantGCKycComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GrantGCKycComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
