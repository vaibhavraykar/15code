import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReferrerTableComponent } from './referrer-table.component';


describe('ReferrerTableComponent', () => {
  let component: ReferrerTableComponent;
  let fixture: ComponentFixture<ReferrerTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReferrerTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReferrerTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
