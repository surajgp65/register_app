import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthInfoService {

  constructor(private route: Router) { }
  authToken: any;

  // set auth token..
  set setAuthToken(val: any) {
    this.authToken = val;
  }
  // get auth token..
  get getAuthToken() {
    return this.authToken;
  }

  // get user info..
  get getuserInfo() {
    return JSON.parse(localStorage.getItem('userInfo'));
  }
  // set user info..
  set setuserInfo(val) {
    localStorage.setItem('userInfo', JSON.stringify(val));
  }


  // if user is already logged in then it will redirect to dashboard page
  loggedUser() {
    if (localStorage.getItem('token')) {
      this.route.navigateByUrl('/dashboard')
    } else {

      this.route.navigateByUrl('/auth')
    }
  }

}
