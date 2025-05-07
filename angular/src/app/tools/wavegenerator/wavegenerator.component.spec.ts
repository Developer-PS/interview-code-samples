import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WavegeneratorComponent } from './wavegenerator.component';

describe('WavegeneratorComponent', () => {
  let component: WavegeneratorComponent;
  let fixture: ComponentFixture<WavegeneratorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WavegeneratorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WavegeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
