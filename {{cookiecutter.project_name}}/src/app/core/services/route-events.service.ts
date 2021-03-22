import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router, RouterEvent} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RouteEventsService {
  private emitChangeSource = new BehaviorSubject<boolean>(false);
  loading$ = this.emitChangeSource.asObservable();


  constructor(private route: Router) {
    route.events.subscribe(r => {
      if (r instanceof RouterEvent) {
        this.navigationInterceptor(r);
      }
    });
  }

  navigationInterceptor(event: RouterEvent): void {
    if (event instanceof NavigationStart) {
      this.emitChangeSource.next(true);
    }
    if (event instanceof NavigationEnd) {
      this.emitChangeSource.next(false);
    }

    // Set loading state to false in both of the below events to hide the spinner in case a request fails
    if (event instanceof NavigationCancel) {
      this.emitChangeSource.next(false);
    }
    if (event instanceof NavigationError) {
      this.emitChangeSource.next(false);
    }
  }
}
