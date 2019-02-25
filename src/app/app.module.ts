import { ErrorInterceptor } from './error-interceptor';
import { AuthInterceptor } from './auth/auth-interceptor';
import { AppRoutingModule } from './app-routing-module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './header/header.component';
import { PostService } from './post/post.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorComponent } from './error/error.component';
import { AngularMaterialModule } from './modules/angular-material.module';
import { PostsModule } from './modules/posts.module';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ErrorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    PostsModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    HttpClientModule
  ],
  providers: [
    PostService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi:true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi:true }
  ],
  bootstrap: [
    AppComponent
  ],
  entryComponents: [
    ErrorComponent
  ]
})
export class AppModule { }
