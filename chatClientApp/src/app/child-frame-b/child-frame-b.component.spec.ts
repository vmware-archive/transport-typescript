import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChildFrameBComponent } from './child-frame-b.component';

describe('ChildFrameBComponent', () => {
  let component: ChildFrameBComponent;
  let fixture: ComponentFixture<ChildFrameBComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChildFrameBComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChildFrameBComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
