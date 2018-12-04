import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CruiseLinesAddComponent } from './cruise-lines-add.component';

describe('CruiseLinesAddComponent', () => {
  let component: CruiseLinesAddComponent;
  let fixture: ComponentFixture<CruiseLinesAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CruiseLinesAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CruiseLinesAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
