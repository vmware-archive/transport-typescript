/*
 * Copyright 2018 VMware, Inc.
 * SPDX-License-Identifier: BSD-2-Clause
 */

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChildFrameDComponent } from './child-frame-d.component';

describe('ChildFrameDComponent', () => {
  let component: ChildFrameDComponent;
  let fixture: ComponentFixture<ChildFrameDComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChildFrameDComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChildFrameDComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
