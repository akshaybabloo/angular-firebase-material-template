import {Injectable} from '@angular/core';
import {BehaviorSubject, from, Observable, of} from 'rxjs';
import {fromPromise} from 'rxjs/internal-compatibility';
import {switchMap, take, tap} from 'rxjs/operators';
import {AngularFireAuth} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AngularAuthService {
  loggedIn = false;
  private userProfileSubject$ = new BehaviorSubject<any>(null);
  userProfile$ = this.userProfileSubject$.asObservable();

  constructor(private auth: AngularFireAuth) {
    auth.onAuthStateChanged(authState => {
      if (authState) {
        this.loggedIn = true;
      }
    });

  }

  getUser$(): Observable<any> {
    return from(this.auth.user).pipe(tap(user => this.userProfileSubject$.next(user)));
  }

  login$(username: string, password: string): Observable<any> {
    return fromPromise(this.auth.signInWithEmailAndPassword(username, password)).pipe(tap(r => {
      if (r.user?.email) {
        this.loggedIn = true;
      }
      this.userProfileSubject$.next(r.user);
    }));
  }

  logout$(): Observable<any> {
    return fromPromise(this.auth.signOut()).pipe(tap(() => this.loggedIn = false));
  }

  forgotPassword$(email: string): Observable<any> {
    return fromPromise(this.auth.sendPasswordResetEmail(email));
  }

  confirmPasswordReset$(code: string, newPassword: string): Observable<any> {
    return fromPromise(this.auth.confirmPasswordReset(code, newPassword));
  }

  getToken$(): Observable<string | null> {
    return this.auth.authState.pipe(
      take(1),
      switchMap((user) => {
        if (user) {
          return from(user.getIdToken());
        }
        return of(null);
      })
    );
  }

  // getUid1$(): Observable<string | null> {
  //   return this.auth.user.pipe(
  //     switchMap(user => user)
  //   )
  // }

}
