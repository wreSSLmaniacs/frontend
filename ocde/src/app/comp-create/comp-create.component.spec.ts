import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompCreateComponent } from './comp-create.component';

describe('CompCreateComponent', () => {
  let component: CompCreateComponent;
  let fixture: ComponentFixture<CompCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
