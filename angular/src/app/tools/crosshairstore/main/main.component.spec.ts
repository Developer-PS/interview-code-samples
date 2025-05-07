import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrosshairstoreMainComponent } from './main.component';

describe('CrosshairstoreMainComponent', () => {
  let component: CrosshairstoreMainComponent;
  let fixture: ComponentFixture<CrosshairstoreMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrosshairstoreMainComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrosshairstoreMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
