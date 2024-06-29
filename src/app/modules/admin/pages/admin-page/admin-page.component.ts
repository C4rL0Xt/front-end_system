import { Component, OnInit } from '@angular/core';
import { ResourceService } from '../../../auth/services/resource-service/resource.service';

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrl: './admin-page.component.css'
})
export class AdminPageComponent implements OnInit{
  message = '';

  constructor(private resourceService: ResourceService){

  }

  ngOnInit(): void {
      this.resourceService.admin().subscribe(data => {
        this.message = data.message;
      },
    err => {
      console.log(err);
    })
  }

}
