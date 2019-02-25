import { CommonModule } from '@angular/common';
import { AngularMaterialModule } from './angular-material.module';
import { PostListComponent } from './../post/post-list/post-list.component';
import { PostComponent } from './../post/post.component';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@NgModule({
    declarations: [
        PostComponent,
        PostListComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        AngularMaterialModule,
        RouterModule
    ]
})
export class PostsModule { }