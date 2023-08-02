import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcceptRejectProductComponent } from './accept-reject-product.component';

describe('AcceptRejectProductComponent', () => {
  let component: AcceptRejectProductComponent;
  let fixture: ComponentFixture<AcceptRejectProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AcceptRejectProductComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcceptRejectProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
