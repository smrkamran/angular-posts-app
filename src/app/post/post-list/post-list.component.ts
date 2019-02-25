import { AuthService } from './../../auth/auth.service';
import { PostService } from './../post.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Post } from '../post.model';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {

posts:Post[] = [];
private postsSub: Subscription;
private authStatusSub: Subscription;
public userIsAuthenticated = false;
userId: string;
isLoading = false;
totalPosts = 0;
postsPerPage = 2;
currentPage = 1;
pageSizeOptions = [1, 2, 5, 10];

  constructor(private postService: PostService, private authService: AuthService) { }

  ngOnInit() {
    this.isLoading = true;
    this.postService.getPosts(this.postsPerPage, this.currentPage);
    this.userId = this.authService.getUserId();

      this.postsSub = this.postService.getPostUpdateListener()
      .subscribe((postData: {posts: Post[], maxPosts: number}) => {
        this.isLoading = false;
        this.posts = postData.posts;
        this.totalPosts = postData.maxPosts;
      });

      this.userIsAuthenticated = this.authService.getIsAuthenticated();
      this.authStatusSub = this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });
  }

  onDelete(id) {
    this.isLoading = true;
    this.postService.deletePost(id).subscribe((response) => {
      this.postService.getPosts(this.postsPerPage, this.currentPage);
    },() => {
      this.isLoading = false;
    });
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postService.getPosts(this.postsPerPage, this.currentPage);
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
}
