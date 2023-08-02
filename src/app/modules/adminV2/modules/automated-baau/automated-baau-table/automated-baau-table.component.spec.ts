import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AutomatedBaauTableComponent } from './automated-baau-table.component';


describe('AutomatedBaauTableComponent', () => {
  let component: AutomatedBaauTableComponent;
  let fixture: ComponentFixture<AutomatedBaauTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AutomatedBaauTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AutomatedBaauTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
