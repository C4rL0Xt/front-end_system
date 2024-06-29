import { Component, OnInit } from '@angular/core';
import anime from 'animejs/lib/anime.es.js';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  constructor() { }

  ngOnInit(): void {
    anime({
      targets: '.forbidden circle, .forbidden line',
      strokeDashoffset: [anime.setDashoffset, 0],
      easing: 'easeInOutSine',
      duration: 2000,
      delay: (el, i) => i * 250,
      direction: 'alternate',
      loop: true
    });
  }
}
