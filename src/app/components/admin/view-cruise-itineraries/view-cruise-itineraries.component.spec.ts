import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCruiseItinerariesComponent } from './view-cruise-itineraries.component';

describe('ViewCruiseItinerariesComponent', () => {
  let component: ViewCruiseItinerariesComponent;
  let fixture: ComponentFixture<ViewCruiseItinerariesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewCruiseItinerariesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCruiseItinerariesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
