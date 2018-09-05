import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChildFrameCComponent } from './child-frame-c.component';

describe('ChildFrameCComponent', () => {
  let component: ChildFrameCComponent;
  let fixture: ComponentFixture<ChildFrameCComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChildFrameCComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChildFrameCComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
