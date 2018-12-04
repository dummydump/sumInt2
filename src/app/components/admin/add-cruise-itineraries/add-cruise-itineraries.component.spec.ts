import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCruiseItinerariesComponent } from './add-cruise-itineraries.component';

describe('AddCruiseItinerariesComponent', () => {
  let component: AddCruiseItinerariesComponent;
  let fixture: ComponentFixture<AddCruiseItinerariesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCruiseItinerariesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCruiseItinerariesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
