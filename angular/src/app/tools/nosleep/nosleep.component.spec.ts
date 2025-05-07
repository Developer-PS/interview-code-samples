import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NosleepComponent } from './nosleep.component';

describe('NosleepComponent', () => {
  let component: NosleepComponent;
  let fixture: ComponentFixture<NosleepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NosleepComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NosleepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
