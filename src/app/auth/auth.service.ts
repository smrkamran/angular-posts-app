import { AuthData } from './auth-data.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

import { environment } from 'src/environments/environment';

const USER_URL = environment.apiUrl + '/user/';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token: string;
  private userId: string;
  private authStatusListener = new Subject<boolean>();
  private isAuthenticated = false;
  private tokenTimer: NodeJS.Timer;

  constructor(private http: HttpClient, private router: Router) { }

  createUser(email: string, password: string) {
    const authData: AuthData = {
      email: email,
      password: password
    };
    
    this.http.post(USER_URL + 'signup', authData)
      .subscribe(response => {
        this.router.navigate(['/']);
      }, error=> {
        this.authStatusListener.next(false);
      });
  }

  loginUser(email:string, password: string) {
    const authData: AuthData = {
      email: email,
      password: password
    };

    this.http.post<{token: string, expiresIn: number, userId: string}>(USER_URL + 'login', authData)
      .subscribe(response => {
        const token = response.token;
        this.token = token;
        if (token) {
          this.userId = response.userId;
          const expiresInDuration = response.expiresIn;
          this.setAuthTimer(expiresInDuration);
          this.isAuthenticated = true;
          this.authStatusListener.next(true);

          const expirationDate = new Date(new Date().getTime() + expiresInDuration * 1000);
          this.saveAuthData(token, expirationDate, this.userId);
          this.router.navigate(['/']);
        }
      }, error => {
        this.authStatusListener.next(false);
      });
  }

  getToken() {
    return this.token;
  }

  getUserId() {
    return this.userId;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }
  
  getIsAuthenticated() {
    return this.isAuthenticated;
  }

  autoAuthUser() {
    const authInfo = this.getAuthData();
    if(!authInfo){
      return;
    }
    const now = new Date();
    const expiresIn = authInfo.expirationDate.getTime() - now.getTime();
    if(expiresIn > 0) {
      this.userId = authInfo.userId;
      this.token = authInfo.token;
      this.isAuthenticated = true;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.userId = null;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/']);
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem('userId', userId);
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
  }

  private getAuthData() {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    if(!token || !expirationDate || !userId) {
      return;
    }

    return {
      userId: userId,
      token: token,
      expirationDate: new Date(expirationDate)
    }
  }

  private clearAuthData() {
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
  }
}
