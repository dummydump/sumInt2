import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CruiseLinesViewComponent } from './cruise-lines-view.component';

describe('CruiseLinesViewComponent', () => {
  let component: CruiseLinesViewComponent;
  let fixture: ComponentFixture<CruiseLinesViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CruiseLinesViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CruiseLinesViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
