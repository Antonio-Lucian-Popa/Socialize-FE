import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Zuck } from 'zuck.js';
import { StoryService } from '../services/story.service';
import { Story } from '../interfaces/story';
import { UserService } from '../services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { StoryUploadModalComponent } from '../story-upload-modal/story-upload-modal.component';
import { AuthService } from 'src/app/auth/services/auth.service';
import { StoriesTimeline, TimelineItem } from 'zuck.js/dist/types';

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
  //   {
  //     user: {
  //       id: 6,
  //       firstName: 'Alexander',
  //       lastName: 'Pierce',
  //       image: 'https://images.unsplash.com/photo-1526948128573-703ee1aeb6fa?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  //     }
  //   },
  //   {
  //     user: {
  //       id: 7,
  //       firstName: 'Kyle',
  //       lastName: 'Morgan',
  //       image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  //     }
  //   },
  //   {
  //     user: {
  //       id: 8,
  //       firstName: 'Bianca',
  //       lastName: 'Jones',
  //       image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  //     }
  //   },
  //   {
  //     user: {
  //       id: 9,
  //       firstName: 'Elena',
  //       lastName: 'Petrova',
  //       image: 'https://images.unsplash.com/photo-1485217988980-11786ced9454?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  //     }
  //   },
  //   {
  //     user: {
  //       id: 9,
  //       firstName: 'Rachel',
  //       lastName: 'Graham',
  //       image: 'https://images.unsplash.com/photo-1602233158242-3ba0ac4d2167?q=80&w=1936&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  //     }
  //   },
  //   {
  //     user: {
  //       id: 10,
  //       firstName: 'Luke',
  //       lastName: 'Zimmermann',
  //       image: 'https://images.unsplash.com/photo-1503443207922-dff7d543fd0e?q=80&w=1854&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  //     }
  //   },
  //   {
  //     user: {
  //       id: 11,
  //       firstName: 'Gina',
  //       lastName: 'Andrews',
  //       image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  //     }
  //   }
  // ];

  stories: Story[] = [];
  newStories: Story[] = [];
  seenStories: Story[] = [];

  myProfileImageUrl: string = 'path-to-profile-image'; // Replace with the actual profile image URL
  myUserName: string = 'Your Name'; // Replace with the actual user name
  myStoryExists: boolean = false;

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
    this.initZuckStories();
  }

 loadStories(): void {
    this.storyService.getNewStories(this.userId).subscribe(newStories => {
      console.log('Fetched new stories:', newStories);
      this.newStories = newStories;
      this.storyService.getSeenStories(this.userId).subscribe(seenStories => {
        console.log('Fetched seen stories:', seenStories);
        this.seenStories = seenStories;
        this.stories = [...this.newStories, ...this.seenStories];
        this.myStoryExists = this.stories.some(story => story.user.id === this.userId);
        console.log('Combined stories:', this.stories);
        this.initZuckStories();
      });
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.storyService.uploadStory(file, this.userId).subscribe(story => {
        this.stories.unshift(story); // Add the new story to the beginning
        this.myStoryExists = true;
        this.initZuckStories();
      });
    }
  }

  onMyStoryClick() {
    if (this.myStoryExists) {
      // Show options to view existing story or upload new story
      if (confirm('Do you want to view your story? Click Cancel to upload a new one.')) {
        this.viewMyStory();
      } else {
        this.openUploadDialog();
      }
    } else {
      // Only show option to upload new story
      this.openUploadDialog();
    }
  }

  viewMyStory() {
    const storyElement = this.storyContainer.nativeElement;  // Direct access to the DOM element
    // Initialize zuck.js to show the user's story
    const zuckStories = this.groupStoriesByUser(this.newStories.concat(this.seenStories));
    Zuck(storyElement, {
      backNative: true,
      autoFullScreen: false,
      skin: 'snapgram',
      avatars: true,
      list: false,
      cubeEffect: true,
      localStorage: true,
      stories: zuckStories
    });
  }

  initZuckStories() {
    const storyElement = this.storyContainer.nativeElement;  // Direct access to the DOM element
    const zuckStories = this.groupStoriesByUser(this.newStories.concat(this.seenStories));
    console.log('Zuck stories:', zuckStories);

    if (zuckStories.length > 0) {
      Zuck(storyElement, {
        backNative: true,
        autoFullScreen: false,
        skin: 'snapgram',
        avatars: true,
        list: false,
        cubeEffect: true,
        localStorage: true,
        stories: zuckStories
      });
    } else {
      console.warn('No stories to display');
    }
  }

  groupStoriesByUser(stories: Story[]): StoriesTimeline {
    console.log('Received stories:', stories);

    const groupedStories = stories.reduce((acc: GroupedStories, story: Story) => {
      console.log('Processing story:', story);

      if (story.user && story.user.id) { // Check if story.user and story.user.id are defined
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
        if (storyItems) { // Extra type check to make sure items exist
          storyItems.push({
            id: 'item-' + story.id,
            type: story.value.endsWith('.mp4') ? 'video' : 'photo',
            length: 5,
            src: story.value,
            preview: '',
            link: '',
            linkText: '',
            seen: story.viewed,
            time: new Date(story.expirationDate).getTime() / 1000
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
          this.stories.unshift(story); // Add the new story to the beginning
          this.myStoryExists = true;
          this.initZuckStories();
        });
      }
    });
  }

}
