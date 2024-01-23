import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { WalletConnectService } from './wallet-connect.service';
import  config  from '../../assets/configFiles/configFile.json';
var ethers = require('ethers');

@Injectable({
  providedIn: 'root'
})
export class DeployContractService {


  // The bytecode from Solidity, compiling the above source
  nftArtistContract: any;
  ArtistMoonBoxNftSwap: any;
  constructor() { }

  async deploy(cs: WalletConnectService, walletAddress: any, collectionName: string,symbol:string) {
    // Read the contract artifact, which was generated by Remix


    // Set gas limit and gas price, using the default Ropsten provider
    try {
      const price = "100000000000";
      const options = { gasLimit: 100000, gasPrice: ethers.utils.parseUnits(price, 'gwei') }

      // Deploy the contract
      let index = environment.chainId.indexOf(parseInt(localStorage.getItem('chainId') ?? "56"));
      this.nftArtistContract = config[environment.configFile][index].artistLootBoxAddress;
      this.ArtistMoonBoxNftSwap = config[environment.configFile][index].ArtistMoonBoxNftSwap;
      if (localStorage.getItem('chainId') == "56" || localStorage.getItem('chainId') == "97") {
        let abi = require('./../../assets/abis/lazy minting/bsc.json');
        let bytecode = require('./../../assets/contractBytecode/bsc.json');
        const factory = new ethers.ContractFactory(abi, bytecode, cs.signer)
        //
        const contract = await factory.deploy(walletAddress, this.nftArtistContract, this.ArtistMoonBoxNftSwap, collectionName, symbol);
        var deployAddress = await contract.deployed();
      }
      else {
        let abi = require('./../../assets/abis/lazy minting/other.json');
        let bytecode = require('./../../assets/contractBytecode/other.json');
        const factory = new ethers.ContractFactory(abi, bytecode, cs.signer)
        //
        const contract = await factory.deploy(walletAddress, this.nftArtistContract, collectionName, symbol);
        var deployAddress = await contract.deployed();
      }
      return ({ deployedAddress: deployAddress.address, status: true });
    }
    catch (e) {
      console.log(e);
      return ({ deployedAddress: "", status: false });
    }


  }
}
