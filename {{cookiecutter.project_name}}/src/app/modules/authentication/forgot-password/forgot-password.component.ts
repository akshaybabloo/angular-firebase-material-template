import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {SnackBarComponent} from '../../../shared/components/snack-bar/snack-bar.component';
import {AngularFireAuth} from '@angular/fire/auth';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  submitted: boolean | undefined;

  forgotPasswordForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  constructor(private fb: FormBuilder, private router: Router, private fireAuth: AngularFireAuth, private snackBar: MatSnackBar) {
  }

  get f(): { [p: string]: AbstractControl } {
    return this.forgotPasswordForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.forgotPasswordForm.invalid) {
      this.submitted = false;
      return;
    }

    this.fireAuth.sendPasswordResetEmail(this.forgotPasswordForm.value.email).then((next: any) => {
      this.snackBar.openFromComponent(SnackBarComponent, {
        politeness: 'polite',
        duration: 8000,
        data: 'Please check your email'
      });
      this.router.navigate(['login']);
    }).catch((err: { code: string; }) => {
      if (err.code === 'auth/user-not-found') {
        this.snackBarMessage('Incorrect username and/or password');
        this.submitted = false;
      } else if (err.code === 'auth/wrong-password') {
        this.snackBarMessage('Incorrect username and/or password');
        this.submitted = false;
      } else {
        console.error(err);
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
}
