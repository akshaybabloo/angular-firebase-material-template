import {Component, OnDestroy, OnInit} from '@angular/core';
import {from, Observable, of, Subscription, throwError} from 'rxjs';
import {filter, map, shareReplay, switchMap} from 'rxjs/operators';
import {NavigationEnd, Router} from '@angular/router';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {AngularFireAuth} from '@angular/fire/auth';
import {RouteEventsService} from '../../services/route-events.service';
import {AngularAuthService} from '../../services/angular-auth.service';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnDestroy, OnInit {
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  public isLoggedIn = false;
  isAdmin = false;
  adminBackground$: Observable<string>;
  hideNav$: Observable<boolean>;
  private authSubscription: Subscription | undefined;
  private logoutSubscription: Subscription | undefined;

  constructor(private breakpointObserver: BreakpointObserver, public auth: AngularAuthService, public router: Router,
              public routeEvent: RouteEventsService, private ngAuth: AngularFireAuth) {

    // check if in admin page and add bg colour accordingly
    this.adminBackground$ = router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      switchMap(m => {
        if (m instanceof NavigationEnd) {
          if (m.urlAfterRedirects.split('/')[1] === 'admin') {
            return from('rgba(197,9,26,.6)');
          }
        }
        return from('inherit');
      })
    ) as Observable<string>;

    // check if in login or register page
    this.hideNav$ = router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      switchMap(m => {
        if (m instanceof NavigationEnd) {
          return of(m.urlAfterRedirects.split('/')[1] === 'login' || m.urlAfterRedirects.split('/')[1] === 'register'
            || m.urlAfterRedirects.split('/')[1] === 'forgot-password');
        }
        return of(false);
      })
    ) as Observable<boolean>;

  }

  ngOnInit(): void {
    this.authSubscription = this.ngAuth.authState.subscribe(user => {
      if (user) {
        this.isLoggedIn = true;
        user.getIdTokenResult().then(token => {
          this.isAdmin = !!token.claims.lectusAdmin;
        });
      }
    });
  }

  login(): void {
    this.isLoggedIn = false;
    this.router.navigate(['login']);
  }

  logout(): void {
    this.logoutSubscription = this.auth.logout$().subscribe(result => {
      this.isLoggedIn = false;
      this.router.navigate(['login']);
    }, error => throwError(error));

  }

  ngOnDestroy(): void {
    this.authSubscription?.unsubscribe();
    this.logoutSubscription?.unsubscribe();
  }

}
