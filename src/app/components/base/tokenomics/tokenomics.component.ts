import { Component, OnInit } from '@angular/core';
import { TokenomicsService } from 'src/app/services/tokenomics.service';

@Component({
  selector: 'app-tokenomics',
  templateUrl: './tokenomics.component.html',
  styleUrls: ['./tokenomics.component.scss']
})
export class TokenomicsComponent implements OnInit {

  public isOldPancakeRouter = true;

  data: any;

  public list: any = [
    [
      {
        key: "total supply:",
        val: "1,000,000,000,000,000",
        shortVal: "(1 quadrillion)"
      },
      {
        key: "circulating supply:",
        val: "---",
        shortVal: ""
      },
      {
        key: "burned forever:",
        val: "---",
        shortVal: ""
      },
     
    ],
    [
      {
        key: "RBITS for 1 eth:",
        val: "---",
        shortVal: ""
      },
      {
        key: "market cap:",
        val: "---",
        shortVal: ""
      },
      {
        key: "price for 1 million RBITS:",
        val: "---",
        shortVal: ""
      },
    
    ]
  ]

  constructor(private tokenomicsService: TokenomicsService) {
  }

  ngOnInit(): void {
    this.getTokenomicsData();
  }

  getTokenomicsData(): void {
    this.data = this.tokenomicsService.tokenomicsData;
    this.replaceData();

    this.tokenomicsService.whenShared().subscribe((data) => {
      this.data = data;
      this.replaceData();
    });
  }

  replaceData(): void {
    if (this.data == undefined)
      return
    this.list[0][1]['val'] = this.data['circulatingSupply'];
    this.list[0][2]['val'] = this.data['burnedAmount'];
    this.list[1][0]['val'] = this.data['priceFor1ETH'];
    this.list[1][1]['val'] = '$' + this.data['marketcap'].substring(0, 13);
    this.list[1][2]['val'] = '$' + this.data['priceFor1mRBITS'].substring(0, 13);
    this.isOldPancakeRouter = this.tokenomicsService.oldPancakeAddress;
  }

  toggleTokenomics(): void {
    this.tokenomicsService.onToggle(false);
  }

}
