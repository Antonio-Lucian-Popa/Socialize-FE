import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { ActivityCardComponent } from './activity-card/activity-card.component';
import { ExploreCardComponent } from './explore-card/explore-card.component';
import { PostListComponent } from './post-list/post-list.component';
import { PostComponent } from './post-list/post/post.component';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import { LikePostModalComponent } from './like-post-modal/like-post-modal.component';
import {MatDialogModule} from '@angular/material/dialog';
import { CommentPostModalComponent } from './comment-post-modal/comment-post-modal.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CommentItemComponent } from './comment-post-modal/comment-item/comment-item.component';
import { StoryListComponent } from './story-list/story-list.component';
import { PostInputComponent } from './post-input/post-input.component';
import { CreatePostModalComponent } from './post-input/create-post-modal/create-post-modal.component';
import { SuggestionCardComponent } from './suggestion-card/suggestion-card.component';
import { WhoFollowCardComponent } from './who-follow-card/who-follow-card.component';
import { NotificationCardComponent } from './notification-card/notification-card.component';
import { TimeAgoPipe } from './pipe/time-ago.pipe';
import { ChangePasswordDialogComponent } from './change-password-dialog/change-password-dialog.component';
import {MatDividerModule} from '@angular/material/divider';
import { ImageViewDialogComponent } from '../features/discovery/image-view-dialog/image-view-dialog.component';

const NB_MODULES: any[] = [
  MatCardModule,
  MatIconModule,
  MatMenuModule,
  MatDialogModule,
  ReactiveFormsModule,
  MatDividerModule
];

const COMPONENTS: any[] = [
  ActivityCardComponent,
  ExploreCardComponent,
  PostListComponent,
  PostComponent,
  StoryListComponent,
  PostInputComponent,
  SuggestionCardComponent,
  WhoFollowCardComponent,
  NotificationCardComponent,
  ImageViewDialogComponent
];

@NgModule({
  declarations: [
    ...COMPONENTS,
    LikePostModalComponent,
    CommentPostModalComponent,
    CommentItemComponent,
    CreatePostModalComponent,
    TimeAgoPipe,
    ChangePasswordDialogComponent,
  ],
  imports: [
    CommonModule,
    ...NB_MODULES
  ],
  exports: [...NB_MODULES, ...COMPONENTS],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class SharedModule { }
