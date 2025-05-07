import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordgeneratorComponent } from './passwordgenerator.component';

describe('PasswordgeneratorComponent', () => {
  let component: PasswordgeneratorComponent;
  let fixture: ComponentFixture<PasswordgeneratorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasswordgeneratorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PasswordgeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
