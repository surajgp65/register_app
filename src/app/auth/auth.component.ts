import { Component, OnInit } from '@angular/core';
import { HttpRequestService } from '../common-services/http-request.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../common-services/common.service';
import { AuthInfoService } from '../common-services/auth-info.service';
import { Router } from '@angular/router';
// import { userInfo } from '';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {
  constructor(
    private http: HttpRequestService,
    private router: Router,
    private authInfo: AuthInfoService,
    private commonService: CommonService,
    private formBuilder: FormBuilder
  ) {}

  loginForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  ngOnInit(): void {
    this.authInfo.loggedUser();
  }
  apiCall() {
    this.commonService.sucsessToaster('Succesfull login');
    this.http.request('get', 'hiesdf', null).subscribe((res) => {});
  }

  // log in api
  onSubmit() {
    try {
      this.http
        .request('post', '/user/login', this.loginForm.value)
        .subscribe((res) => {
          this.authInfo.setAuthToken = res['token'];
          localStorage.setItem('token', this.authInfo.getAuthToken);
          this.authInfo.setuserInfo = res['user'];
          this.router.navigateByUrl('/dashboard');
        });
    } catch (error) {
      console.log('error', error);
    }
  }
}
