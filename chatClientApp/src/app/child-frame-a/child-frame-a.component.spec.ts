/*
 * Copyright 2018 VMware, Inc.
 * SPDX-License-Identifier: BSD-2-Clause
 */

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChildFrameAComponent } from './child-frame-a.component';

describe('ChildFrameAComponent', () => {
  let component: ChildFrameAComponent;
  let fixture: ComponentFixture<ChildFrameAComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChildFrameAComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChildFrameAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
