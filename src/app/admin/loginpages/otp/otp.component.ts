import { Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  ChangePassword,
  ChangePasswordresponse,
} from 'src/app/core/model-class/login-signup';
import { ApiService } from 'src/app/core/services/api.service';
import { DataService } from 'src/app/core/services/data.service';
import { JwtService } from 'src/app/core/services/jwt.service';
import { LoginService } from 'src/app/core/services/login.service';
import { NgClass } from '@angular/common';

@Component({
    selector: 'app-otp',
    standalone: true,
    templateUrl: './otp.component.html',
    styleUrl: './otp.component.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [FormsModule, ReactiveFormsModule, NgClass, RouterLink]
})
export class OtpComponent implements OnInit {
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  private apiservice = inject(ApiService);
  private dataService = inject(DataService);
  private jwtService = inject(JwtService);
  private loginService = inject(LoginService);
  private route = inject(ActivatedRoute);

  activeLink: string = 'Login';
  url1: any;
  userId: any;

  ResetPassword!: FormGroup;
  Token: any;
  ngOnInit() {
    // this.userId = this.jwtService.getpanelUserId();
    this.route.url.subscribe((segments) => {
      // Access the last segment which contains the token
      this.userId = segments[segments.length - 2].path;
      this.Token = segments[segments.length - 1].path;
      console.log('Extracted userId:', this.userId);
      console.log('Extracted Token:', this.Token);
    });

    this.ResetPassword = this.formBuilder.group(
      {
        NewPassword: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(16),
          ],
        ],
        confirmPassword: ['', Validators.required],
      },
      { validator: this.passwordMatchValidator },
    );
  }

  passwordMatchValidator(
    control: AbstractControl,
  ): { [key: string]: boolean } | null {
    const newPassword = control.get('NewPassword');
    const confirmPassword = control.get('confirmPassword');

    if (newPassword?.value !== confirmPassword?.value) {
      control.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    return null;
  }

  openSecondsuccess: boolean = false;
  successName: any = '';
  // reset pasword code
  ChangePassword: ChangePassword = new ChangePassword();
  ChangePasswordresponse: ChangePasswordresponse = new ChangePasswordresponse();
  errorMessage: any;
  submitted!: boolean;
  erroroutput: boolean = false;

  // changePassword(){

  // }

  changePassword() {
    this.errorMessage = '';
    if (this.ResetPassword.valid) {
      this.ChangePassword.user_id = this.userId;
      this.ChangePassword.password =
        this.ResetPassword.get('NewPassword')?.value;
      this.ChangePassword.password_confirmation =
        this.ResetPassword.get('confirmPassword')?.value;
      this.ChangePassword.type = 'admin';
      const body = JSON.stringify(this.ChangePassword);

      console.log(body);
      this.loginService.AdminResetPassword(body).subscribe((response: any) => {
        this.errorMessage = response.message;
        if (response.status === 200) {
          this.submitted = true;
          console.log('success');
          this.successName = 'Reset Password';
          setTimeout(() => {
            this.openSecondsuccess = true;
            setTimeout(() => {
              this.openSecondsuccess = false;
              this.ngOnInit();
              this.router.navigate(['/sign_in']);
            }, 1800);
          }, 200);
        } else {
          this.erroroutput = true;
          this.submitted = false;
          console.log('fail');
        }
      });
    } else {
      this.submitted = false;
      this.errorMessage = 'please Enter All The Details';
      this.ResetPassword.markAllAsTouched();
      console.log(this.findInvalidControls(this.ResetPassword));
    }
  }

  findInvalidControls(formName: any) {
    const invalid = [];
    const controls = formName.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    console.log(invalid);
    return invalid;
  }

  markAllAsTouched() {
    for (const control in this.ResetPassword.controls) {
      if (this.ResetPassword.controls.hasOwnProperty(control)) {
        this.ResetPassword.controls[control].markAsTouched();
      }
    }
  }

  isreset: boolean = false;
  closeModal() {
    this.openSecondsuccess = false;
  }
}
