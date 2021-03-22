import {AfterViewInit, Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import firebase from 'firebase/app';
import {MatSnackBar} from '@angular/material/snack-bar';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularAuthService} from '../../../core/services/angular-auth.service';
import {SnackBarComponent} from '../../../shared/components/snack-bar/snack-bar.component';
import PhoneInfoOptions = firebase.auth.PhoneInfoOptions;

declare var grecaptcha: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, AfterViewInit {

  loginForm: FormGroup | any;
  verifyForm: FormGroup | any;
  submitted = false;
  verify = false;
  submittedVerify = false;
  private recaptchaVerifier: firebase.auth.RecaptchaVerifier | undefined;
  private verificationId: string | undefined;
  private recaptchaWidgetId: number | undefined;
  private resolver: firebase.auth.MultiFactorResolver | undefined;

  constructor(private fb: FormBuilder, private router: Router, public auth: AngularAuthService, private snackBar: MatSnackBar,
              private mainAuth: AngularFireAuth) {
  }

  get f(): { [p: string]: AbstractControl } | undefined {
    return this.loginForm?.controls;
  }

  get v(): { [p: string]: AbstractControl } | undefined {
    return this.verifyForm?.controls;
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    this.verifyForm = this.fb.group({
      code: ['', Validators.required]
    });
  }

  ngAfterViewInit(): void {
    this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
      size: 'invisible',
    });
    this.recaptchaVerifier.render().then(widgetId => {
      this.recaptchaWidgetId = widgetId;
    });
  }

  login(): void {
    this.submitted = true;

    if (this.loginForm?.invalid) {
      this.submitted = false;
      return;
    }

    this.auth.login$(this.loginForm?.value.email, this.loginForm?.value.password)
      .subscribe(result => {
        this.router.navigate(['dashboard']);
      }, error => {
        if (error.code === 'auth/user-not-found') {
          this.snackBarMessage('Incorrect username and/or password');
          this.submitted = false;
        } else if (error.code === 'auth/too-many-requests') {
          this.snackBarMessage(error.message);
          this.submitted = false;
        } else if (error.code === 'auth/wrong-password') {
          this.snackBarMessage('Incorrect username and/or password');
          this.submitted = false;
        } else if (error.code === 'auth/multi-factor-auth-required') {

          this.resolver = error.resolver;
          const phoneInfoOptions: PhoneInfoOptions = {
            multiFactorHint: this.resolver?.hints[0],
            session: !this.resolver?.session
          };

          const phoneAuthProvider = new firebase.auth.PhoneAuthProvider();
          if (this.recaptchaVerifier !== undefined) {
            const id = phoneAuthProvider.verifyPhoneNumber(phoneInfoOptions, this.recaptchaVerifier).then(value => {
              this.snackBarMessage('Verification code sent');
              this.verificationId = value;
              this.verify = true;
            }).catch(reason => {
              if (reason.code === 'auth/too-many-requests') {
                this.snackBarMessage(error.message);
                this.submitted = false;
              } else {
                this.snackBarMessage('Unable to verify 2FA. See console for more information');
                this.submitted = false;
                console.error(reason);
              }
              grecaptcha.reset(this.recaptchaWidgetId);
            });
          }

        } else {
          console.error(error);
        }
      });
  }

  snackBarMessage(message: string): void {
    this.snackBar.openFromComponent(SnackBarComponent, {
      politeness: 'polite',
      duration: 8000,
      data: message
    });
  }

  forgotPassword(): void {
    this.router.navigate(['forgot-password']);
  }

  verifyLogin(): void {
    this.submittedVerify = true;

    if (this.verificationId !== undefined) {
      const cred = firebase.auth.PhoneAuthProvider.credential(this.verificationId, this.verifyForm?.value.code);
      const multiFactorAssertion = firebase.auth.PhoneMultiFactorGenerator.assertion(cred);

      this.resolver?.resolveSignIn(multiFactorAssertion).then(value => {
        this.router.navigate(['dashboard']);
      }).catch(reason => {
        this.snackBarMessage('Unable to verify 2FA. See console for more information');
        this.submittedVerify = false;
        console.error(reason);
      });
    }
  }
}
