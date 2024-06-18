import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Zuck } from 'zuck.js';
import { StoryService } from '../services/story.service';
import { Story } from '../interfaces/story';
import { UserService } from '../services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { StoryUploadModalComponent } from '../story-upload-modal/story-upload-modal.component';
import { AuthService } from 'src/app/auth/services/auth.service';
import { forkJoin } from 'rxjs';
import { StoriesTimeline, TimelineItem } from 'zuck.js/dist/types';
import { User } from '../interfaces/user-profile-data';

interface GroupedStories {
  [key: string]: TimelineItem;
}

@Component({
  selector: 'app-story-list',
  templateUrl: './story-list.component.html',
  styleUrls: ['./story-list.component.scss']
})
export class StoryListComponent implements OnInit, AfterViewInit {

  @ViewChild('storyContainer', { static: false })
  storyContainer!: ElementRef;

  @ViewChild('fileInput', { static: false })
  fileInput!: ElementRef;

  @Input()
  userId!: string;

  stories: Story[] = [];
  newStories: Story[] = [];
  seenStories: Story[] = [];

  myProfileImageUrl!: string;
  myUserName!: string;
  myStoryExists: boolean = false;
  myUserId!: string;

  zuckInstance: any; // Track the Zuck instance
  storyMap: Map<string, TimelineItem> = new Map(); // Map to track added stories

  constructor(private storyService: StoryService, private userService: UserService, private dialog: MatDialog, private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.getUserId().then((userId) => {
      if (userId) {
        this.userId = userId;
        this.loadUserProfile();
      }
    });

    this.userService.userUpdatedInformation.subscribe((res: User) => {
      this.myProfileImageUrl = res.profileImageUrl;
    });

    if (!!this.myProfileImageUrl || (!!this.myProfileImageUrl) && (!!this.userService.userInfo && !!this.userService.userInfo.profileImageUrl)) {
      this.myProfileImageUrl = this.userService.userInfo.profileImageUrl;
    }
  }

  loadUserProfile(): void {
    this.userService.getUserProfileInfo(this.userId).subscribe(userInfo => {
      console.log(userInfo);
      this.myUserId = userInfo.id;
      this.myUserName = `${userInfo.firstName} ${userInfo.lastName}`;
      this.myProfileImageUrl = userInfo.profileImageUrl;
      this.loadStories();
    });
  }

  ngAfterViewInit(): void {
    this.initZuckInstance();
  }

  loadStories(): void {
    forkJoin({
      newStories: this.storyService.getNewStories(this.userId),
      seenStories: this.storyService.getSeenStories(this.userId)
    }).subscribe(({ newStories, seenStories }) => {
      this.stories = [...newStories, ...seenStories];
      this.myStoryExists = this.stories.some(story => story.user.id === this.userId);
      console.log('Stories:', this.stories);
      this.updateZuckStories();
    });
  }

  initZuckInstance() {
    const storyElement = this.storyContainer.nativeElement;
    this.zuckInstance = Zuck(storyElement, {
      backNative: true,
      autoFullScreen: false,
      skin: 'snapgram',
      avatars: true,
      list: false,
      cubeEffect: true,
      localStorage: false,
      stories: []
    });
  }

  onMyStoryClick() {
    this.openUploadDialog();
  }

  groupStoriesByUser(stories: Story[]): StoriesTimeline {
    console.log('Received stories:', stories);

    const groupedStories = stories.reduce((acc: GroupedStories, story: Story) => {
      console.log('Processing story:', story);

      if (story.user && story.user.id) {
        const userId = 'user-' + story.user.id; // Ensure unique ID for each user
        if (!acc[userId]) {
          acc[userId] = {
            id: userId,
            photo: story.user.profileImageUrl,
            name: story.user.firstName,
            items: []
          };
          console.log('Created new group for user:', acc[userId]);
        }

        const storyItems = acc[userId].items;
        const storyItemExists = storyItems!.some(item => item.id === 'item-' + story.id);
        if (!storyItemExists) { // Ensure no duplicates
          storyItems!.push({
            id: 'item-' + story.id,
            type: story.value.endsWith('.mp4') ? 'video' : 'photo',
            length: 5,
            src: story.value,
            preview: '',
            link: '',
            linkText: '',
            seen: story.viewed,
            time: new Date(story.createdAt).getTime() / 1000
          });
          console.log('Added item to group:', acc[userId]);
        }
      } else {
        console.log('Skipped story due to missing user or user ID:', story);
      }

      return acc;
    }, {} as GroupedStories);

    const result = Object.values(groupedStories) as StoriesTimeline;
    console.log('Grouped stories:', result);
    return result;
  }

  updateZuckStories() {
    if (!this.zuckInstance) {
      console.error('Zuck instance is not initialized.');
      return;
    }

    const zuckStories = this.groupStoriesByUser(this.stories);
    console.log('Updating Zuck stories:', zuckStories);

    // Remove existing stories to avoid duplication
    const existingStories = this.zuckInstance.data.stories || [];
    existingStories.forEach((story: any) => {
      this.zuckInstance.remove(story.id);
    });

    // Add stories
    zuckStories.forEach(story => {
      if (story.id) {
        this.zuckInstance.add(story);
        this.storyMap.set(story.id, story);
      }
    });
  }

  openUploadDialog() {
    const dialogRef = this.dialog.open(StoryUploadModalComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe((result: File) => {
      if (result) {
        console.log(result);
        this.storyService.uploadStory(result, this.userId).subscribe(story => {
          this.addOrUpdateStory(story);
        });
      }
    });
  }

  addOrUpdateStory(story: Story) {
    const newItem = {
      id: 'item-' + story.id,
      type: story.value.endsWith('.mp4') ? 'video' : 'photo',
      length: 5,
      src: story.value,
      preview: '',
      link: '',
      linkText: '',
      seen: story.viewed,
      time: new Date(story.createdAt).getTime() / 1000
    };

    const userId = 'user-' + story.user.id;
    const existingStory = this.storyMap.get(userId);

    if (existingStory && existingStory.items) {
      this.zuckInstance.addItem(userId, newItem);
      existingStory.items.push(newItem);
    } else {
      const newTimelineItem: TimelineItem = {
        id: userId,
        photo: story.user.profileImageUrl,
        name: story.user.firstName,
        items: [newItem]
      };
      this.zuckInstance.add(newTimelineItem);
      this.storyMap.set(userId, newTimelineItem);
    }

    this.stories.push(story); // Add the new story to the beginning of all stories
    this.myStoryExists = true;
  }


  markStoryAsViewed(storyId: string) {
    console.log('Marking story as viewed:', storyId);
    const story = this.stories.find(story => story.id === storyId);
    if (story) {
      this.storyService.markStoryAsViewed(story.id, this.myUserId).subscribe(() => {
        story.viewed = true;
        this.updateZuckStories();
      });
    } else {
      console.error('Story not found:', storyId);
    }
  }
}
