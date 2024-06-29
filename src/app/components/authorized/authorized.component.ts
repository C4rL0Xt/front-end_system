import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-authorized',
  templateUrl: './authorized.component.html',
  styleUrl: './authorized.component.css',
})
export class AuthorizedComponent implements OnInit {
  code = '';
  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    /*this.activatedRoute.queryParams.subscribe((data) => {
      this.code = data['code'];
    });*/
  }
}
