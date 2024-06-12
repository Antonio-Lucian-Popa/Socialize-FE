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

  @ViewChild('storyContainer')
  storyContainer!: ElementRef;

  @ViewChild('fileInput', { static: false })
  fileInput!: ElementRef;

  @Input()
  userId!: string;

  stories!: Story[];
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
  }

  loadUserProfile(): void {
    this.userService.getUserProfileInfo(this.userId).subscribe(userInfo => {
      console.log(userInfo)
      this.myUserName = userInfo.firstName + ' ' + userInfo.lastName;
      this.myProfileImageUrl = userInfo.profileImageUrl;
      this.loadStories();
    });
  }

  ngAfterViewInit(): void {
    this.initZuckStories(); // Initialize Zuck stories
  }

  loadStories(): void {
    forkJoin({
      newStories: this.storyService.getNewStories(this.userId),
      seenStories: this.storyService.getSeenStories(this.userId)
    }).subscribe(({ newStories, seenStories }) => {
      this.stories = [...newStories, ...seenStories];
      this.myStoryExists = this.stories.some(story => story.user.id === this.userId);
      console.log('Stories:', this.stories);
      this.initZuckStories(); // Reinitialize Zuck stories
    });
  }

  initZuckStories() {
    const storyElement = this.storyContainer.nativeElement;  // Direct access to the DOM element
    const zuckStories = this.groupStoriesByUser(this.stories);
    console.log('Zuck stories:', zuckStories);

    if (zuckStories.length > 0) {
      this.zuckInstance = Zuck(storyElement, { // Initialize Zuck instance
        backNative: true,
        autoFullScreen: false,
        skin: 'snapgram',
        avatars: true,
        list: false,
        cubeEffect: true,
        localStorage: false,
        stories: zuckStories
      });
      console.log('Zuck instance:', this.zuckInstance)
    } else {
      console.warn('No stories to display');
    }
  }

  onMyStoryClick() {
    this.openUploadDialog(); // Open upload dialog
  }

  groupStoriesByUser(stories: Story[]): StoriesTimeline {
    console.log('Received stories:', stories);

    const groupedStories = stories.reduce((acc: GroupedStories, story: Story) => {
      console.log('Processing story:', story);

      if (story.user && story.user.id) {
        if (!acc[story.user.id]) {
          acc[story.user.id] = {
            id: story.user.id,
            photo: story.user.profileImageUrl,
            name: story.user.firstName,
            items: []
          };
          console.log('Created new group for user:', acc[story.user.id]);
        }

        const storyItems = acc[story.user.id].items;
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
          console.log('Added item to group:', acc[story.user.id]);
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

  openUploadDialog() {
    const dialogRef = this.dialog.open(StoryUploadModalComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe((result: File) => {
      if (result) {
        console.log(result);
        this.storyService.uploadStory(result, this.userId).subscribe(story => {
          this.addOrUpdateStory(story); // Add or update story
          console.log('Story uploaded:', story);
        });
      }
    });
  }

  addOrUpdateStory(story: Story) {
    const storyItem = {
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

    let existingStory = null;
    const storyExist = this.zuckInstance && this.zuckInstance.data && this.zuckInstance.data.stories;
    if(storyExist) {
      existingStory = this.zuckInstance.data.stories.find((s: any) => s.id === story.user.id);
    }


    if (existingStory) {
      this.zuckInstance.addItem(story.user.id, storyItem); // Add item to existing story
    } else {
      this.zuckInstance.add({ // Add new story
        id: story.user.id,
        photo: story.user.profileImageUrl,
        name: story.user.firstName,
        items: [storyItem]
      });
    }
  }

}
