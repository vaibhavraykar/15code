import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReferrerDetailsTableComponent } from './referrer-details-table.component';


describe('ReferrerDetailsTableComponent', () => {
  let component: ReferrerDetailsTableComponent;
  let fixture: ComponentFixture<ReferrerDetailsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReferrerDetailsTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReferrerDetailsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
