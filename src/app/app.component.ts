import { Component, OnInit, ViewChild } from '@angular/core';
import { HeaderUserComponent } from './shared/components/header-user/header-user.component';
import { NavigationEnd, Router, Event } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'bbraun-client';

  @ViewChild('menu') menu: HeaderUserComponent;

  constructor(
    private router: Router
  ) {

  }

  ngOnInit(): void {
    /*
    this.router.events.pipe(
      filter((event: Event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.menu.getLogged();
    });
    */
  }
}
