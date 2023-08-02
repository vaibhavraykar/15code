import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReferrerDetailsListComponent } from './referrer-details-list.component';


describe('ReferrerDetailsListComponent', () => {
  let component: ReferrerDetailsListComponent;
  let fixture: ComponentFixture<ReferrerDetailsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReferrerDetailsListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReferrerDetailsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
