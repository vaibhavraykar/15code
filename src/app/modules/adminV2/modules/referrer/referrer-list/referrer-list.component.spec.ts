import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReferrerListComponent } from './referrer-list.component';


describe('ReferrerListComponent', () => {
  let component: ReferrerListComponent;
  let fixture: ComponentFixture<ReferrerListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReferrerListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReferrerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
