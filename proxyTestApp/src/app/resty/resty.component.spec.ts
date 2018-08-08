import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RestyComponent } from './resty.component';

describe('RestyComponent', () => {
  let component: RestyComponent;
  let fixture: ComponentFixture<RestyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RestyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RestyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
