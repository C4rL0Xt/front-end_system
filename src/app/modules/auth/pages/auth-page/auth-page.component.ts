import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth-service/auth.service';
import { TokenService } from '../../services/token-service/token.service';

@Component({
  selector: 'app-auth-page',
  templateUrl: './auth-page.component.html',
  styleUrl: './auth-page.component.css'
})
export class AuthPageComponent implements OnInit {
  code = '';
  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private tokenService: TokenService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((data) => {
      this.code = data['code'];
      const code_verifier = this.tokenService.getVerifier();
      this.tokenService.deleteVerifier();
      this.getToken(this.code, code_verifier);
    });
  }

  getToken(code: string, code_verifier: string): void {
    this.authService.getToken(code, code_verifier).subscribe(
      data => {
        this.tokenService.setTokens(data.access_token, data.refresh_token);
        const rol = this.extractRolFromToken(data.access_token);
        this.tokenService.setRolUser(rol);
        this.tokenService.setEmailUser(this.extractEmailFromToken(data.access_token));
        this.router.navigate(['/home']);
      },
      err => {
        console.log(err);
      }
    );
  }

  extractRolFromToken(tok: string): string {
    if (tok) {
      const token = tok;
      const payload = token.split('.')[1];
      const payloadDecoded = atob(payload);
      const values = JSON.parse(payloadDecoded);
      const rol = values.roles || [];

      return rol;
    } else {
      return null;
    }
  }

  extractEmailFromToken(tok: string): string {
    if (tok) {
      const token = tok;
      const payload = token.split('.')[1];
      const payloadDecoded = atob(payload);
      const values = JSON.parse(payloadDecoded);
      const email = values.email || [];

      return email;
    } else {
      return null;
    }
  }


}
