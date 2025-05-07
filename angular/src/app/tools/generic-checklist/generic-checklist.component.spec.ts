import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericChecklistComponent } from './generic-checklist.component';

describe('GenericChecklistComponent', () => {
  let component: GenericChecklistComponent;
  let fixture: ComponentFixture<GenericChecklistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenericChecklistComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenericChecklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
