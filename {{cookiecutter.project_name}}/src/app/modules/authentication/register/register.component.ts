import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AngularAuthService} from '../../../core/services/angular-auth.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {AngularFireAuth} from '@angular/fire/auth';
import {throwError} from 'rxjs';
import {SnackBarComponent} from '../../../shared/components/snack-bar/snack-bar.component';
import {passwordValidator} from '../../../shared/validators/password-validator';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerForm = this.fb.group({
    fullName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', [Validators.required, Validators.minLength(8)]]
  }, {validators: passwordValidator});

  submitted = false;

  constructor(private fb: FormBuilder, private router: Router, public auth: AngularAuthService, private snackBar: MatSnackBar,
              private fireAuth: AngularFireAuth) {
  }

  get f(): { [p: string]: AbstractControl } | undefined {
    return this.registerForm?.controls;
  }

  ngOnInit(): void {

  }

  forgotPassword(): void {

  }

  register(): void {

    if (this.registerForm.valid) {
      this.fireAuth.createUserWithEmailAndPassword(this.registerForm.value.email, this.registerForm.value.confirmPassword)
        .then(r => {
          r.user?.sendEmailVerification().then(() => {}).catch(k => throwError(k));
          r.user?.updateProfile({displayName: this.registerForm.value.fullName}).then(() => {}).catch(k => throwError(k));
        })
        .catch(err => {
          if (err.code === 'auth/email-already-in-use') {
            this.snackBarMessage('This email is already in use');
          } else {
            throwError(err);
          }
        });
    }

  }

  snackBarMessage(message: string): void {
    this.snackBar.openFromComponent(SnackBarComponent, {
      politeness: 'polite',
      duration: 8000,
      data: message
    });
  }

}
