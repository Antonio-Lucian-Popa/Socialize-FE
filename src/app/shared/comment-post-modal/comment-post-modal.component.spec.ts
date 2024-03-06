import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentPostModalComponent } from './comment-post-modal.component';

describe('CommentPostModalComponent', () => {
  let component: CommentPostModalComponent;
  let fixture: ComponentFixture<CommentPostModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommentPostModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommentPostModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
