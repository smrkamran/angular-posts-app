import { AuthGuard } from './auth/auth.guard';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PostListComponent } from './post/post-list/post-list.component';
import { PostComponent } from './post/post.component';


const routes: Routes = [
    { path: '', component: PostListComponent },
    { path: 'create', component: PostComponent, canActivate: [AuthGuard] },
    { path: 'edit/:postId', component: PostComponent, canActivate: [AuthGuard] },
    { path: 'auth', loadChildren: "./modules/auth.module#AuthModule"}
];

 @NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: [AuthGuard]
 })
 export class AppRoutingModule {

 } 