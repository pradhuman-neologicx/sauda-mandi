import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy
} from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { JwtService } from 'src/app/core/services/jwt.service';
import { LoginService } from 'src/app/core/services/login.service';
import { ApiService } from 'src/app/core/services/api.service';
import { DataService } from 'src/app/core/services/data.service';
import { NotificationService } from 'src/app/core/services/notificationnew.service';
import { NgClass } from '@angular/common';

@Component({
    selector: 'app-signin',
    standalone: true,
    templateUrl: './signin.component.html',
    styleUrls: ['./signin.component.scss'],
    animations: [
        trigger('succesfullyMesaage', [
            state('void', style({
                transform: 'translateX(-30%)',
                opacity: 0,
            })),
            transition(':enter, :leave', [
                animate('0.8s cubic-bezier(0.68, -0.55, 0.27, 1.55)'),
            ]),
        ]),
        trigger('slideIn', [
            state('void', style({
                transform: 'translateX(100%)',
                opacity: 0,
            })),
            transition(':enter', [
                animate('0.5s ease-out', style({
                    transform: 'translateX(0)',
                    opacity: 1,
                })),
            ]),
        ]),
        trigger('fadeSlide', [
            transition(':enter', [
                style({ opacity: 0, transform: 'translateY(12px)' }),
                animate('0.4s ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
            ]),
        ]),
    ],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [FormsModule, ReactiveFormsModule, NgClass, RouterLink]
})
export class SigninComponent implements OnInit, OnDestroy {
  title = 'Login';

  // ── Forms ──
  signIn!: FormGroup;

  // ── UI state ──
  openSecondsuccess: boolean = false;
  successName: any = '';
  errorMessage: any = '';
  showErrorMessage: boolean = false;
  submitted!: boolean;
  isLoading: boolean = false;
  showPassword: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private apiservice: ApiService,
    private dataService: DataService,
    private jwtService: JwtService,
    private notificationService: NotificationService,
    private loginService: LoginService,
  ) {}

  ngOnInit(): void {
    this.signIn = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  // ══════════════════════════════════════════
  // Login — Static Mock Login (Backend API commented for now)
  // ══════════════════════════════════════════
  readonly demoEmail = 'admin@saudamandi.com';
  readonly demoPassword = 'Password@123';

  fillDemoCredentials() {
    this.signIn.patchValue({
      email: this.demoEmail,
      password: this.demoPassword,
    });
    this.errorMessage = '';
  }

  onLogin() {
    this.errorMessage = '';
    if (this.signIn.valid) {
      this.isLoading = true;
      const { email, password } = this.signIn.value;

      // Static login while backend is not ready
      setTimeout(() => {
        this.isLoading = false;
        if (
          email.trim().toLowerCase() === this.demoEmail &&
          password === this.demoPassword
        ) {
          this.handleLoginSuccess({
            status: 200,
            message: 'Logged in successfully (Static Demo)',
            data: {
              token: 'static-demo-jwt-token-sauda-mandi',
              user: {
                id: 1,
                name: 'Sauda Admin',
                email: this.demoEmail,
                role: 'Super Admin',
              },
            },
          });
        } else {
          const msg = `Invalid credentials. Use ${this.demoEmail} / ${this.demoPassword}`;
          this.notificationService.show(msg, 'error');
          this.errorMessage = msg;
        }
      }, 450);

      /* Uncomment when backend API is ready:
      this.apiservice.post('auth/login', { email, password }).subscribe({
        next: (res: any) => {
          this.isLoading = false;
          if (res.status === 200) {
            this.handleLoginSuccess(res);
          } else {
            this.notificationService.show(res.message || 'Login failed', 'error');
            this.errorMessage = res.message || 'Login failed';
          }
        },
        error: (err: any) => {
          this.isLoading = false;
          this.errorMessage = err.message || 'Server error occurred';
        }
      });
      */
    } else {
      this.notificationService.show('Please fix the errors in the form', 'error');
      this.errorMessage = 'Please fix the errors in the form';
      this.markAllAsTouched();
    }
  }

  handleLoginSuccess(response: any) {
    this.submitted = true;
    this.successName = 'Login';
    const loginData = response.data;

    setTimeout(() => {
      this.openSecondsuccess = true;
      setTimeout(() => {
        this.openSecondsuccess = false;
        this.jwtService.savepanelUserId(loginData.user.id);
        this.jwtService.saveadminame(loginData.user.name);
        this.jwtService.saveAdminToken(loginData.token);
        this.jwtService.saveAdminRole(loginData.user.role);
        this.jwtService.isLoggedIn(true);
        this.router.navigate(['/admin/dashboard']);
      }, 1800);
    }, 200);
  }

  // ── Utility ──
  closeModal() {
    this.openSecondsuccess = false;
  }

  markAllAsTouched() {
    for (const control in this.signIn.controls) {
      if (this.signIn.controls.hasOwnProperty(control)) {
        this.signIn.controls[control].markAsTouched();
      }
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
    return invalid;
  }

  ngOnDestroy() {
    // No intervals to clear anymore
  }
}
