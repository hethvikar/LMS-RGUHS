import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Router, NavigationEnd } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import * as fromAuth from './core/store/auth/auth.reducer';
import { AppState } from './core/store';
import * as AuthActions from './core/store/auth/auth.actions';
import { HeaderComponent } from './shared/components/header/header.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Placement Cell System';
  isAuthenticated$: Observable<boolean>;
  currentUserRole$: Observable<string | null>;
  isLoginPage = false;

  constructor(
    private store: Store<AppState>,
    private router: Router
  ) {
    this.isAuthenticated$ = this.store.select(fromAuth.selectIsAuthenticated);
    this.currentUserRole$ = this.store.select(fromAuth.selectUser).pipe(
      map(user => user?.role || null)
    );
  }

  ngOnInit() {
    // Load user from localStorage on app init
    this.store.dispatch(AuthActions.loadUser());

    // Check if current route is login page
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event) => {
        const navigationEvent = event as NavigationEnd;
        this.isLoginPage = navigationEvent.url === '/login' || navigationEvent.url.startsWith('/login');
      });
  }
}
