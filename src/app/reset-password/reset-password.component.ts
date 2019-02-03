import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss', '../login-page/login-page.component.css']
})
export class ResetPasswordComponent implements OnInit {
  passwordForm: FormGroup;
  resetToken: string;
  isError = false;
  isReset = false;

  constructor(private route: ActivatedRoute, private router: Router, private authService: AuthService) { 
    this.resetToken = this.route.snapshot.queryParams['oobCode'];

    this.passwordForm = new FormGroup({
      password: new FormControl('', [Validators.required]),
      verifyPassword: new FormControl('', [Validators.required])
    })
  }

  ngOnInit() {

  }

  doResetPassword() {
    const password = this.passwordForm.get('password').value

    this.authService.handleResetPassword(password, this.resetToken).then(resp => {
      this.isReset = true;
    }).catch(e => {
      this.isError = true;
      alert(e);
    });
  }

}
