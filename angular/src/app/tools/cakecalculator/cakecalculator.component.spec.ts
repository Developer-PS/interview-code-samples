import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CakecalculatorComponent } from './cakecalculator.component';

describe('CakecalculatorComponent', () => {
  let component: CakecalculatorComponent;
  let fixture: ComponentFixture<CakecalculatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CakecalculatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CakecalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
