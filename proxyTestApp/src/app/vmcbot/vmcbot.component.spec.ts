import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VmcbotComponent } from './vmcbot.component';

describe('VmcbotComponent', () => {
  let component: VmcbotComponent;
  let fixture: ComponentFixture<VmcbotComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VmcbotComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VmcbotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
