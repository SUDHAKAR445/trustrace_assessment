import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CuisineDetailComponent } from './cuisine-detail.component';

describe('CuisineDetailComponent', () => {
  let component: CuisineDetailComponent;
  let fixture: ComponentFixture<CuisineDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CuisineDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CuisineDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
