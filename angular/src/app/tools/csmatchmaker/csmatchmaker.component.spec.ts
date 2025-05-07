import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CSMatchmakerComponent } from './csmatchmaker.component';

describe('CsmatchmakerComponent', () => {
  let component: CSMatchmakerComponent;
  let fixture: ComponentFixture<CSMatchmakerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CSMatchmakerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CSMatchmakerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
