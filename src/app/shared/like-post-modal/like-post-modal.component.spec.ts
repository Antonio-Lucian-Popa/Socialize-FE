import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LikePostModalComponent } from './like-post-modal.component';

describe('LikePostModalComponent', () => {
  let component: LikePostModalComponent;
  let fixture: ComponentFixture<LikePostModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LikePostModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LikePostModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
