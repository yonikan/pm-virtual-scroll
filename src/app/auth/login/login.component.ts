import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  isLoading = false;
  form: FormGroup;
  username = null;
  password = null;

  constructor(public authService: AuthService) {}

  ngOnInit() {
    this.form = new FormGroup({
      usernameText: new FormControl(this.username, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      passwordText: new FormControl(this.password, {
        validators: [Validators.required, Validators.minLength(3)]
      })
    });
  }

  onLogin() {
    if (!this.form.valid) {
      return;
    }
    // this.isLoading = true;
    this.authService.login(this.form.value.usernameText, this.form.value.passwordText);
  }
}