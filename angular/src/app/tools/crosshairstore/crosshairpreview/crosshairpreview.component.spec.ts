import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrosshairpreviewComponent } from './crosshairpreview.component';

describe('CrosshairpreviewComponent', () => {
  let component: CrosshairpreviewComponent;
  let fixture: ComponentFixture<CrosshairpreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrosshairpreviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrosshairpreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
