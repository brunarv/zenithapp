import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ZenithListComponent } from './zenith-list.component';

describe('ZenithListComponent', () => {
  let component: ZenithListComponent;
  let fixture: ComponentFixture<ZenithListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ZenithListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZenithListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
