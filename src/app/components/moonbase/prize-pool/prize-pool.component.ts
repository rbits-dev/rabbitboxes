import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-prize-pool',
  templateUrl:'./prize-pool.component.html',
  styleUrls: ['./prize-pool.component.scss']
})
export class PrizePoolComponent implements OnInit {

  static readonly routeName: string = 'prizepool';
  constructor() { }

  ngOnInit(): void {
  }

}
