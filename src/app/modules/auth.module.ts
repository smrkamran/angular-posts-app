import { AuthRoutingModule } from './auth-routing.module';
import { CommonModule } from '@angular/common';
import { AngularMaterialModule } from './angular-material.module';
import { NgModule } from '@angular/core';
import { SignupComponent } from '../auth/signup/signup.component';
import { LoginComponent } from '../auth/login/login.component';
import { FormsModule } from '@angular/forms';

@NgModule({
    declarations: [
        LoginComponent,
        SignupComponent
    ],
    imports: [
        CommonModule,
        AngularMaterialModule,
        FormsModule,
        AuthRoutingModule
    ]
})
export class AuthModule { }