import { Post } from './post.model';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

const POSTS_URL = environment.apiUrl + '/posts/';

@Injectable()
export class PostService {

    constructor(private http: HttpClient,
        private router: Router) {}

    private posts: Post[] = [];
    private postsUpdated = new Subject<{posts: Post[], maxPosts: number}>();

    getPosts(postsPerPage: number, currentPage: number) {
        const queryParams = `?pageSize=${postsPerPage}&page=${currentPage}`;
        this.http.get<{message: string, data: any, maxPosts: number}>(POSTS_URL + queryParams)
        .pipe(map((postData) => {
            return {posts: postData.data.map((post) => {
                return{
                    imageUrl: post.imageUrl,
                    title: post.title,
                    content: post.content,
                    id: post._id,
                    creator: post.creator
                };
            }), maxPosts: postData.maxPosts};
        }))
        .subscribe((data) => {
            this.posts = data.posts;
            this.postsUpdated.next({posts: [...this.posts], maxPosts: data.maxPosts});
        });
    }

    getPost(id: string) {
        return this.http.get<{_id: string, title: string, content: string, imageUrl: string}>(POSTS_URL + id);
    }

    addPost(title: string, content: string, image: File) {
        const postData = new FormData();
        postData.append("title", title);
        postData.append("content", content);
        postData.append("image", image, title);
        this.http.post(POSTS_URL, postData).subscribe((res: any) => {
            this.router.navigate(['/']);
        });
    }

    updatePost(id: string, title: string, content: string, image: File | string) {
        let postData: Post | FormData;
        if (typeof(image) === 'object') {
            postData = new FormData();
            postData.append('id', id);
            postData.append('title', title);
            postData.append('content', content);
            postData.append('image', image, title);
        } else {
            postData = {
                id: id,
                title: title,
                content: content,
                imageUrl: image,
                creator: null
            }
        }
         this.http.put(POSTS_URL + id, postData)
            .subscribe(response => {
                console.log(response);
                this.router.navigate(['/']);
            });
    }

    deletePost(id) {
        return this.http.delete(POSTS_URL + id);
    }

    getPostUpdateListener() {
        return this.postsUpdated.asObservable();
    }
}