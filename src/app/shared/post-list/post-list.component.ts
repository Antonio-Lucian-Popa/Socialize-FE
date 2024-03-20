import { Component, OnInit } from '@angular/core';
import { PostService } from '../services/post.service';
import { Subscription } from 'rxjs';
import { LoadingBarService } from '@ngx-loading-bar/core';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit {

  posts: any[] = [
    {
      id: 32,
      description: 'Explore the world',
      imageFilenames: [
        'https://images.unsplash.com/photo-1682686578842-00ba49b0a71a?q=80&w=1975&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://plus.unsplash.com/premium_photo-1676823570926-238f23020786?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://images.unsplash.com/photo-1709428590519-cb6529ea40af?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
      ],
      user: {
        id: 45,
        firstName: 'John',
        lastName: 'Doe',
        profileImage: 'https://images.unsplash.com/photo-1618641986557-1ecd230959aa?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
      },
      likes: [
        {
          id: 1,
          user: {
            id: 45,
            firstName: 'John',
            lastName: 'Doe',
            profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
          }
        },
        {
          id: 2,
          user: {
            id: 46,
            firstName: 'Jane',
            lastName: 'Doe',
            profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
          }
        }
      ],
      numberOfComments: 12, // TODO: Fetch comments from API when user clicks on comments,
      createdAt: new Date()
    },
    {
      id: 32,
      description: 'Explore the world',
      imageFilenames: [
        'https://images.unsplash.com/photo-1682686578842-00ba49b0a71a?q=80&w=1975&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://plus.unsplash.com/premium_photo-1676823570926-238f23020786?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://images.unsplash.com/photo-1709428590519-cb6529ea40af?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
      ],
      user: {
        id: 45,
        firstName: 'John',
        lastName: 'Doe',
        profileImage: 'https://images.unsplash.com/photo-1618641986557-1ecd230959aa?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
      },
      likes: [
        {
          id: 1,
          user: {
            id: 45,
            firstName: 'John',
            lastName: 'Doe',
            profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
          }
        },
        {
          id: 2,
          user: {
            id: 46,
            firstName: 'Jane',
            lastName: 'Doe',
            profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
          }
        }
      ],
      numberOfComments: 30, // TODO: Fetch comments from API when user clicks on comments,
      createdAt: new Date()
    },
    {
      id: 32,
      description: 'Explore the world',
      imageFilenames: [],
      user: {
        id: 45,
        firstName: 'John',
        lastName: 'Doe',
        profileImage: 'https://images.unsplash.com/photo-1618641986557-1ecd230959aa?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
      },
      likes: [
        {
          id: 1,
          user: {
            id: 45,
            firstName: 'John',
            lastName: 'Doe',
            profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
          }
        },
        {
          id: 2,
          user: {
            id: 46,
            firstName: 'Jane',
            lastName: 'Doe',
            profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
          }
        }
      ],
      numberOfComments: 30, // TODO: Fetch comments from API when user clicks on comments,
      createdAt: new Date()
    }
  ];


  private subscription: Subscription = new Subscription();

  constructor(private postService: PostService, private loadingBar: LoadingBarService) {}

  ngOnInit(): void {
    this.subscription.add(this.postService.postCreated.subscribe((postData) => {
      this.uploadFiles(postData);
    }));

    // Initialize your posts array here...
  }

  uploadFiles(postData: any): void {
    this.postService.createPost(postData.userId, postData.createPostDto, postData.images)
      .subscribe({
        next: (progress) => {
          if (typeof progress === 'number') {
            // Directly set the progress on ngx-loading-bar
            this.loadingBar.set(progress);
          } else {
            // Final response
            console.log('Upload complete', progress);
            this.loadingBar.complete(); // Finish the loading bar process
            this.posts.unshift(progress); // Add the new post to the top of the list
          }
        },
        error: () => this.loadingBar.stop()
      });
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  loadPosts(): void {
    this.loadingBar.start();
    // Your logic to load posts
    // this.postService.getPosts().subscribe(posts => {
    //   this.posts = posts;
    //   this.loadingBar.complete();
    // }, error => {
    //   console.error("Failed to load posts", error);
    //   this.loadingBar.stop();
    // });
  }

}
