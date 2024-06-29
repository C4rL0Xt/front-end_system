import { Component, OnInit } from '@angular/core';
import { TokenService } from '../../../../auth/services/token-service/token.service';
import { environment } from '../../../../../../environments/environment';
import { ResourceService } from '../../../../auth/services/resource-service/resource.service';

@Component({
  selector: 'app-testhome',
  templateUrl: './testhome.component.html',
  styleUrl: './testhome.component.css'
})
export class TesthomeComponent implements OnInit {
  /*
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
    }*/

  message = '';

  constructor(private resourceService: ResourceService) {

  }

  ngOnInit(): void {
    this.resourceService.user().subscribe(data => {
      this.message = data.message;
    },
      err => {
        console.log(err);
      })
  }


}
