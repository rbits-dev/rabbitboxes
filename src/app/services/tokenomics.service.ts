import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import Web3 from 'web3';

import uniswapABI from '../../assets/web3/router-abi.json';
import tokenABI from '../../assets/web3/rbits-abi.json';
import { CHAIN_CONFIGS } from "../components/base/wallet/connect/constants/blockchain.configs";
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TokenomicsService {
  private toggle = new Subject<any>();
  private data = new Subject<any>();
  private interval: any;
  private serverError: boolean = false;
  public tokenomicsData: any;
  public oldPancakeAddress = true;


  onToggle(state?: boolean) {
    this.toggle.next(state);
  }

  whenToggled(): Observable<any> {
    return this.toggle.asObservable();
  }

  onShare(state: any) {
    this.tokenomicsData = state;
    this.data.next(state);
  }

  whenShared(): Observable<any> {
    return this.data.asObservable();
  }

  init(): void {
    try {
      this.getTokenomicsData().then(() => {
        this.interval = setInterval(() => this.getTokenomicsData(), 30000);
      });
    } catch (e) {
      console.log("Error loading tokenomics data", e);
    }
  }

  async getTokenomicsData() {
      try {
          const web3Provider = new Web3.providers.HttpProvider( CHAIN_CONFIGS[ 1 ].rpcUrls[0] );
          const web3 = new Web3(web3Provider);

          const uniswapRouter = new web3.eth.Contract(uniswapABI as any, "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D");
          const ssRouter = new web3.eth.Contract(tokenABI as any, environment.tokenContractAddress);

          const WETH = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
          const USD = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";

          const amount = web3.utils.toWei("1");

          const usdPAir = await uniswapRouter.methods.getAmountsOut(amount, [WETH, USD]).call();
          const uniTotalOutputSell = await uniswapRouter.methods.getAmountsOut(amount, [WETH, environment.tokenContractAddress]).call();

          const totalSupply = await ssRouter.methods.totalSupply().call();
          const deadBalance = await ssRouter.methods.balanceOf("0x000000000000000000000000000000000000dead").call();
          const vestedBalance = await ssRouter.methods.balanceOf("0xFafd585780Df0f500Ed9321676FA51fca872B419").call();
          const deployerBalance = await ssRouter.methods.balanceOf("0x40EfAf29632a0dc49E862FF902947Dcb85Be6979").call();

          const totalSupplyBN = web3.utils.toBN(totalSupply);
          const deadSupplyBN = web3.utils.toBN(deadBalance);
          const vestedBalanceBN = web3.utils.toBN(vestedBalance);
          const deployerBalanceBN = web3.utils.toBN(deployerBalance);

          const circSupply = totalSupplyBN.sub(deadSupplyBN).sub(vestedBalanceBN).sub(deployerBalanceBN);

          const circ = circSupply.div(web3.utils.toBN(1e9)).toNumber();
          const dead = deadSupplyBN.div(web3.utils.toBN(1e9)).toNumber();
          const oneETHinRBITS = (uniTotalOutputSell[1] / 1e9) * 0.95;

          const price1ETHinUSD = usdPAir[1] / 1e6;

          const marketcap = circ * (price1ETHinUSD / oneETHinRBITS);
          const priceOf1RBITSInUSD = price1ETHinUSD / oneETHinRBITS;

          const priceFor1mRBITSInUSD = 1e6 * priceOf1RBITSInUSD;

          const data = {
            'circulatingSupply': this.formatAmount(circ),
            'burnedAmount': this.formatAmount(dead),
            'priceFor1ETH': this.formatAmount(oneETHinRBITS),
            'marketcap': this.formatAmount(marketcap),
            'priceFor1mRBITS': this.formatAmountD(priceFor1mRBITSInUSD),
          };

          this.onShare(data);

      } catch (e) {
          console.log("Error loading tokenomics data", e);
          clearInterval(this.interval);
      }
  }


  formatAmount(amount: any) {
    return amount.toLocaleString('en-US', {minimumFractionDigits: 0, maximumFractionDigits: 0});
  }

  formatAmountD(amount) {
    const formattedAmount = amount.toLocaleString('en-US', {minimumFractionDigits: 9, maximumFractionDigits: 9});
    return formattedAmount.replace(".", ",");
  }
}
