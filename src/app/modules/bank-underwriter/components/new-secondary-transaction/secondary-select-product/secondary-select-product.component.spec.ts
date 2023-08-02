import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecondarySelectProductComponent } from './secondary-select-product.component';

describe('SecondarySelectProductComponent', () => {
  let component: SecondarySelectProductComponent;
  let fixture: ComponentFixture<SecondarySelectProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SecondarySelectProductComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SecondarySelectProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
