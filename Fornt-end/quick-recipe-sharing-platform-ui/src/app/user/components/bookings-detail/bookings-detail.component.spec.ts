import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingsDetailComponent } from './bookings-detail.component';

describe('BookingsDetailComponent', () => {
  let component: BookingsDetailComponent;
  let fixture: ComponentFixture<BookingsDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookingsDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookingsDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
