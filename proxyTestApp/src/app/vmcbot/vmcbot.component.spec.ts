import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VMCBot } from './vmcbot.component';

describe('VMCBot', () => {
  let component: VMCBot;
  let fixture: ComponentFixture<VMCBot>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VMCBot ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VMCBot);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
