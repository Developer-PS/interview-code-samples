import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataEncoderComponent } from './data-encoder.component';

describe('DataEncoderComponent', () => {
  let component: DataEncoderComponent;
  let fixture: ComponentFixture<DataEncoderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataEncoderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DataEncoderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
