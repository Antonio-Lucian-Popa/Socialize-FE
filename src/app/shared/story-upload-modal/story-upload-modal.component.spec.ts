import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoryUploadModalComponent } from './story-upload-modal.component';

describe('StoryUploadModalComponent', () => {
  let component: StoryUploadModalComponent;
  let fixture: ComponentFixture<StoryUploadModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StoryUploadModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StoryUploadModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
