import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YourPostComponent } from './your-post.component';

describe('YourPostComponent', () => {
  let component: YourPostComponent;
  let fixture: ComponentFixture<YourPostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ YourPostComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YourPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
