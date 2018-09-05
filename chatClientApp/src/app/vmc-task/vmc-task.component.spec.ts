import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VmcTaskComponent } from './vmc-task.component';

describe('VmcTaskComponent', () => {
  let component: VmcTaskComponent;
  let fixture: ComponentFixture<VmcTaskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VmcTaskComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VmcTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
