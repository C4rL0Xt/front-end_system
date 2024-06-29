import { Component, OnDestroy, OnInit } from '@angular/core';


const CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
import { HttpParams } from '@angular/common/http';
import * as CryptoJS from 'crypto-js';
import { environment } from '../../../../../environments/environment';
import { TokenService } from '../../services/token-service/token.service';
import { ActivatedRoute, Params, Router } from '@angular/router';


@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent implements OnInit, OnDestroy {
  authorize_uri = environment.authorize_uri;

  isLoggedOut: boolean;

  isLogged: boolean;
  isAdmin: boolean;

  params: any = {
    client_id: environment.client_id,
    redirect_uri: environment.redirect_uri,
    scope: environment.scope,
    response_type: environment.response_type,
    response_mode: environment.response_mode,
    code_challenge_method: environment.code_challenge_method,
  };

  constructor(
    private tokenService: TokenService,
    private router: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.getLogged();
    this.tokenService.clear();
  }

  ngOnDestroy(): void {

  }

  verifyLoggedOut(): void {
    this.router.queryParams.subscribe((params: Params) => {
      this.isLoggedOut = params['isLoggedOut'] === true;

      if (this.isLoggedOut) {
        console.log('El usuario ha cerrado sesión correctamente');
      }
    })
  }

  getLogged(): void {
    this.isLogged = this.tokenService.isLogged();
    this.isAdmin = this.tokenService.isAdmin();

  }

  onLogin(): void {
    const code_verifier = this.generateCodeVerifier();
    this.tokenService.setVerifier(code_verifier);
    this.params.code_challenge = this.generateCodeChallenge(code_verifier);
    const httpParams = new HttpParams({ fromObject: this.params });
    const codeUrl = this.authorize_uri + httpParams.toString();
    location.href = codeUrl;
    console.log("si esta ejecutando");
  }


  generateCodeVerifier(): string {
    let result = '';
    const char_length = CHARACTERS.length;
    for (let i = 0; i < 44; i++) {
      result += CHARACTERS.charAt(Math.floor(Math.random() * char_length));
    }
    return result;
  }

  generateCodeChallenge(code_verifier: string): string {
    const codeverifierHash = CryptoJS.SHA256(code_verifier).toString(CryptoJS.enc.Base64);
    const code_challenge = codeverifierHash
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');

    return code_challenge;
  }
}
