import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotallowdComponent } from './notallowd.component';

describe('NotallowdComponent', () => {
  let component: NotallowdComponent;
  let fixture: ComponentFixture<NotallowdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotallowdComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotallowdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
