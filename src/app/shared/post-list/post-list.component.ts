import { Component, Input, OnInit } from '@angular/core';
import { PostService } from '../services/post.service';
import { Subscription, finalize, forkJoin } from 'rxjs';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { UserService } from '../services/user.service';
import { PostDto } from '../interfaces/post-dto';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit {

  @Input() userId!: string;
  @Input() isMyPosts = false;
  @Input() includeFollowers: boolean = false;

  posts: PostDto[] = [
    // {
    //   id: 32,
    //   description: 'Explore the world',
    //   imageFilenames: [
    //     'https://images.unsplash.com/photo-1682686578842-00ba49b0a71a?q=80&w=1975&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    //     'https://plus.unsplash.com/premium_photo-1676823570926-238f23020786?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    //     'https://images.unsplash.com/photo-1709428590519-cb6529ea40af?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    //   ],
    //   user: {
    //     id: 45,
    //     firstName: 'John',
    //     lastName: 'Doe',
    //     profileImage: 'https://images.unsplash.com/photo-1618641986557-1ecd230959aa?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    //   },
    //   likes: [
    //     {
    //       id: 1,
    //       user: {
    //         id: 45,
    //         firstName: 'John',
    //         lastName: 'Doe',
    //         profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    //       }
    //     },
    //     {
    //       id: 2,
    //       user: {
    //         id: 46,
    //         firstName: 'Jane',
    //         lastName: 'Doe',
    //         profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    //       }
    //     }
    //   ],
    //   numberOfComments: 12, // TODO: Fetch comments from API when user clicks on comments,
    //   createdAt: new Date()
    // },
    // {
    //   id: 32,
    //   description: 'Explore the world',
    //   imageFilenames: [
    //     'https://images.unsplash.com/photo-1682686578842-00ba49b0a71a?q=80&w=1975&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    //     'https://plus.unsplash.com/premium_photo-1676823570926-238f23020786?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    //     'https://images.unsplash.com/photo-1709428590519-cb6529ea40af?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    //   ],
    //   user: {
    //     id: 45,
    //     firstName: 'John',
    //     lastName: 'Doe',
    //     profileImage: 'https://images.unsplash.com/photo-1618641986557-1ecd230959aa?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    //   },
    //   likes: [
    //     {
    //       id: 1,
    //       user: {
    //         id: 45,
    //         firstName: 'John',
    //         lastName: 'Doe',
    //         profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    //       }
    //     },
    //     {
    //       id: 2,
    //       user: {
    //         id: 46,
    //         firstName: 'Jane',
    //         lastName: 'Doe',
    //         profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    //       }
    //     }
    //   ],
    //   numberOfComments: 30, // TODO: Fetch comments from API when user clicks on comments,
    //   createdAt: new Date()
    // },
    // {
    //   id: 32,
    //   description: 'Explore the world',
    //   imageFilenames: [],
    //   user: {
    //     id: 45,
    //     firstName: 'John',
    //     lastName: 'Doe',
    //     profileImage: 'https://images.unsplash.com/photo-1618641986557-1ecd230959aa?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    //   },
    //   likes: [
    //     {
    //       id: 1,
    //       user: {
    //         id: 45,
    //         firstName: 'John',
    //         lastName: 'Doe',
    //         profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    //       }
    //     },
    //     {
    //       id: 2,
    //       user: {
    //         id: 46,
    //         firstName: 'Jane',
    //         lastName: 'Doe',
    //         profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    //       }
    //     }
    //   ],
    //   numberOfComments: 30, // TODO: Fetch comments from API when user clicks on comments,
    //   createdAt: new Date()
    // }
  ];

  page: number = 0;
  size: number = 10;
  morePostsAvailable: boolean = false;

  private subscription: Subscription = new Subscription();

  constructor(private postService: PostService, private loadingBar: LoadingBarService, private userService: UserService) { }

  ngOnInit(): void {

    // TODO: Make be req for get user info, because the event emmiter not work after ngOnDestroy
    this.subscription.add(this.postService.postCreated.subscribe((postData) => {
      this.uploadFiles(postData);
    }));

    this.postService.postDeleted.subscribe((postId) => {
      // this.loadPosts();
      this.posts.splice(this.posts.findIndex(post => post.id === postId), 1);
    });

    // Initialize your posts array here...
    if (this.userId) {
      this.loadPosts();
    }
  }

  loadMorePosts() {
    this.page += 1; // Increment the page number to fetch the next page of posts
    this.subscription.add(
      this.postService.findAllPostsByUserId(this.userId, this.page, this.size, this.includeFollowers).subscribe((posts) => {
        // Append the new posts to the existing ones
        this.posts = [...this.posts, ...posts.content];
        // Update the morePostsAvailable flag
        this.morePostsAvailable = posts.totalPages > (posts.pageable.pageNumber + 1);
      })
    );
  }


  uploadFiles(postData: any): void {
    const createPost$ = this.postService.createPost(postData.userId, postData.createPostDto, postData.images);
    const getProfileImage$ = this.userService.getProfileImageAsBase64(postData.userId);
    forkJoin([createPost$, getProfileImage$]).pipe(
      finalize(() => {
        // this.loadingBar.complete(); // Always complete the loading bar whether the requests are successful or not
      })
    ).subscribe({
      next: ([progress, image]) => {
        progress.user.profileImage = image; // Set the image to the progress.user.profileImage
        this.posts.unshift(progress); // Add the post to the beginning of the posts array
      },
      error: () => {
        console.error('Error occurred during the requests');
      }
    });
  }

  editPost(postData: any): void {
    this.postService.editPostById(postData.postId, postData.userId, postData.payload, postData.images).subscribe({
      next: (response) => {
        console.log('Post updated successfully', response);
        // Handle successful delete action, e.g., update UI accordingly
        this.postService.postEdited.next(response);
      },
      error: (error) => {
        console.error('Error deleting the post', error);
        // Handle error case
      },
    });
  }

  loadPosts(page: number = 0, size: number = 10): void {
    console.log('Loading posts for user:', this.userId, 'Page:', page, 'Size:', size, this.isMyPosts)
    this.postService.findAllPostsByUserId(this.userId, page, size, this.includeFollowers).subscribe({
      next: (response) => {
        console.log(response)
        this.posts = response.content;
        this.page = response.pageable.pageNumber;
        this.size = response.pageable.pageSize;
        // Check if there are more pages available
        this.morePostsAvailable = response.totalPages > (response.pageable.pageNumber + 1);
      },
      error: (error) => {
        console.error('Error loading posts:', error);
      },
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  // loadPosts(): void {
  //   this.loadingBar.start();
  //   // Your logic to load posts
  //   // this.postService.getPosts().subscribe(posts => {
  //   //   this.posts = posts;
  //   //   this.loadingBar.complete();
  //   // }, error => {
  //   //   console.error("Failed to load posts", error);
  //   //   this.loadingBar.stop();
  //   // });

  //   this.postService.getPosts
  // }

}
