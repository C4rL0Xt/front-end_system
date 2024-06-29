import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from '../../../services/token-service/token.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../../environments/environment';

@Component({
  selector: 'app-logout-page',
  templateUrl: './logout-page.component.html',
  styleUrl: './logout-page.component.css'
})
export class LogoutPageComponent implements OnInit {

  logout_url = environment.logout_url;

  constructor(
    private router: Router, private http: HttpClient

  ) {

  }

  confirmLogout() {
    this.http.post(this.logout_url, { withCredentials: true }).subscribe(() => {
      console.log('quefue')
      this.router.navigate(['/main']);
    })
  }

  cancelLogout() {
    this.router.navigate(['/home'])
  }


  ngOnInit(): void {
    /*this.tokenService.clear();
    this.router.navigate(['']);*/
  }

}
