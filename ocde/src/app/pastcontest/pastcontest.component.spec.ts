import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PastcontestComponent } from './pastcontest.component';

describe('PastcontestComponent', () => {
  let component: PastcontestComponent;
  let fixture: ComponentFixture<PastcontestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PastcontestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PastcontestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
