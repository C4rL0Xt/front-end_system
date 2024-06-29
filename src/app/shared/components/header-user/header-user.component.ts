import { Component, OnDestroy, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpParams } from '@angular/common/http';
import { TokenService } from '../../../modules/auth/services/token-service/token.service';
import * as CryptoJS from 'crypto-js';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfileService } from '../../services/profile/profile.service';
import { Empleado } from '../../../core/models/empleado.model';

const CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

@Component({
  selector: 'app-header-user',
  templateUrl: './header-user.component.html',
  styleUrl: './header-user.component.css'
})
export class HeaderUserComponent implements OnInit, OnDestroy {

  authorize_uri = environment.authorize_uri;
  logout_url = environment.logout_url;

  empleado: Empleado;

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
    private profileService: ProfileService
  ) { }

  ngOnInit(): void {
    this.getLogged();
    this.loadProfile();

  }

  ngOnDestroy(): void {

    console.log('me destruyo');
  }

  onLogout(): void {
    location.href = this.logout_url;
  }

  getLogged(): void {
    this.isLogged = this.tokenService.isLogged();
    this.isAdmin = this.tokenService.isAdmin();

  }

  loadProfile(): void {
    this.profileService.getEmployeeData(this.tokenService.getEmailUser()).subscribe(
      (data: Empleado) => {
        console.log('Datos del empleado: ', data);
        this.empleado = data;
      },
      err => {
        console.log(err);
      }
    );
  }

}
