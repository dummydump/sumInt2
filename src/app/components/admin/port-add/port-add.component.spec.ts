import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PortAddComponent } from './port-add.component';

describe('PortAddComponent', () => {
  let component: PortAddComponent;
  let fixture: ComponentFixture<PortAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PortAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PortAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
