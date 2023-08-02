import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyingNewRequestComponent } from './buying-new-request.component';

describe('BuyingNewRequestComponent', () => {
  let component: BuyingNewRequestComponent;
  let fixture: ComponentFixture<BuyingNewRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuyingNewRequestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuyingNewRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
