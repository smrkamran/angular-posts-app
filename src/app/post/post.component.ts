import { AuthService } from './../auth/auth.service';
import { Subscription } from 'rxjs';
import { PostService } from './post.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Post } from './post.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { mimeType } from './mime-type.validator';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit, OnDestroy {

  private authStatusSub: Subscription;
  private mode = 'create';
  private postId: string;
  public post: Post;
  isLoading = false;
  form: FormGroup;
  imagePreview: string;

  constructor(private postService: PostService,
              public route: ActivatedRoute,
              private authService: AuthService) { }

  onSavePost() {
    if (this.form.invalid)
      return;

    this.isLoading = true;

    if (this.mode === 'create'){
      this.postService.addPost(
        this.form.value.title, 
        this.form.value.content, 
        this.form.value.image
        );
    } else {
      let post: Post = {
        id: this.postId, 
        title: this.form.value.title,
        content: this.form.value.content,
        imageUrl: null,
        creator: null
      };
      this.postService.updatePost(
        this.postId, 
        this.form.value.title, 
        this.form.value.content, 
        this.form.value.image
        );
    }
    this.form.reset();
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({image: file});
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  ngOnInit() {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(authStatus => {
      this.isLoading = false;
    });
    this.form = new FormGroup({
      'title': new FormControl(null, {
        validators: [Validators.required, Validators.minLength(5)]
      }),
      'content': new FormControl(null, {
        validators: [Validators.required, Validators.minLength(5)]
      }),
      'image': new FormControl(null, {
        validators:[Validators.required],
        asyncValidators: [mimeType]
      })

    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.isLoading = true;
        setTimeout(() => {
          this.postService.getPost(this.postId).subscribe((result: any) => {
            this.isLoading = false;
            this.post = { 
              id: result._id, 
              title: result.title, 
              content: result.content,
              imageUrl: result.imageUrl,
              creator: {
                id: result.creator.id,
                name: result.creator.name
              }
            };
            this.form.setValue({
              'title': this.post.title, 
              'content': this.post.content,
              'image': this.post.imageUrl
            });
          });
        },1000);
        
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    })
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }

}
