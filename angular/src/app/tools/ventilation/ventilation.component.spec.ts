import {ComponentFixture, TestBed} from '@angular/core/testing';

import {VentilationComponent} from './ventilation.component';

describe('VenilationComponent', () => {
  let component: VentilationComponent;
  let fixture: ComponentFixture<VentilationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VentilationComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(VentilationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
