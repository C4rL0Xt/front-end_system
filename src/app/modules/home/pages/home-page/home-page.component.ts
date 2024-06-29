import { Component, OnInit } from '@angular/core';
import { ResourceService } from '../../../auth/services/resource-service/resource.service';
import { TokenService } from '../../../auth/services/token-service/token.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent implements OnInit {
  /*

  message = '';

  constructor(private resourceService: ResourceService){

  }

  ngOnInit(): void {
      this.resourceService.user().subscribe(data => {
        this.message = data.message;
      },
    err => {
      console.log(err);
    })
  }
    */
  token = '';
  rol = '';
  constructor(
    private tokenService: TokenService
  ) {
    this.token = this.tokenService.getAccessToken();
    this.rol = this.tokenService.getRolUser();
  }

  ngOnInit(): void {
    console.log(btoa('client:secret'));
    this.showTokenAccess();
    this.showRolUser();
  }

  showTokenAccess(): void {
    console.log(this.token);
  }

  showRolUser(): void {
    console.log(this.rol)
  }


}
