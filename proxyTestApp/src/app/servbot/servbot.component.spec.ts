/*
 * Copyright 2018 VMware, Inc.
 * SPDX-License-Identifier: BSD-2-Clause
 */

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServbotComponent } from './servbot.component';

describe('ServbotComponent', () => {
  let component: ServbotComponent;
  let fixture: ComponentFixture<ServbotComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServbotComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServbotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
