import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { WindowRefService } from './window-ref.service';
import { ethers } from 'ethers';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { LocalStorageService } from './local-storage.service';
import Web3 from 'web3';
import Web3Modal from "web3modal";

export const SilverAddress = environment.silverAddress;
export const LootboxAddress = environment.lootboxAddress;
export const NFTAddress = environment.NFTAddress;
export const ArtistNFTAddress = environment.artistNFTAddress;

const providerMainNetURL = environment.providerMainNetURL;
const providerTestNetURL = environment.providerTestNetURL;
const providerChainID = environment.chainId;

const silverTokenAbi = require('./../../assets/abis/silverTokenAbi.json');
const lootBoxAbi = require('./../../assets/abis/lootBoxAbi.json');
const NFTAbi = require('./../../assets/abis/NFTAbi.json');
const ArtistNFTAbi = require('./../../assets/abis/ArtistNFTAbi.json');
const buyContractAddress = environment.buyContractAddress;

const NETWORK = 'binance';
const config = require('./../../assets/configFiles/configFile.json');

import mshotTokenAbi from './../../assets/abis/mshot.token.abi.json';
import buyMshotTokenAbi from './../../assets/abis/buy-moonshot-token.abi.json';

//  Create WlletConnect Provider
const providerOptions = {
  rpc: {
    56: providerMainNetURL,
    97: providerTestNetURL,
  },
  network: NETWORK,
  chainId: providerChainID,
};

const providerOptionsForMSHOT = {
  walletconnect: {
    package: WalletConnectProvider,
    rpc: {
      1: providerMainNetURL,
      56: providerMainNetURL,
      97: providerTestNetURL,
    },
    network: NETWORK,
    chainId: providerChainID,
  }
};


const web3Modal = new Web3Modal({
  theme: "dark",
  cacheProvider: false, // optional
  providerOptions: providerOptionsForMSHOT, // required
  disableInjectedProvider: false
});


@Injectable({
  providedIn: 'root'
})

export class WalletConnectService {

  chainId: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  private selectedChainId: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  private readonly ACCOUNTS_CHANGED: string = 'accountsChanged';
  private readonly CHAIN_CHANGED: string = 'chainChanged';
  private readonly DISCONNECT: string = 'disconnect';
  private readonly ETH_REQUEST_ACCOUNTS: string = 'eth_requestAccounts';

  public data = new Subject<any>();
  private connectedStateSubject = new Subject<boolean>();
  public tokenomicsData: any;
  public oldPancakeAddress = true;
  private isConnected = false;
  private account = '';
  provider: ethers.providers.Web3Provider;
  signer: ethers.providers.JsonRpcSigner;
  SilverContract: any;
  LootboxContract: any;
  NFTContract: any;
  artistLootBoxContract: any;
  artistLootBoxContractGet: any;
  LootBoxContractGet: any;
  ChainId: number = 0;

  constructor(
    private windowRef: WindowRefService,
    private toastrService: ToastrService,
    private localStorageService: LocalStorageService
  ) { }

  updateData(state: any) {
    this.tokenomicsData = state;
    this.data.next(state);
  }

  getData(): Observable<any> {
    return this.data.asObservable();
  }

  async init(): Promise<boolean> {
    const wallet = this.localStorageService.getWallet();
    switch (wallet) {
      case 1:
        await this.connectToWallet(wallet);
        break;
      case 2:
        await this.connectToWalletConnect(wallet);
        break;
    }

    // await this.localStorageService.getAddress();
    var web3Provider = new Web3.providers.HttpProvider('https://data-seed-prebsc-1-s1.binance.org:8545/');
    var web3 = new Web3(web3Provider);
    this.SilverContract = new web3.eth.Contract(silverTokenAbi, SilverAddress);

    this.artistLootBoxContractGet = new web3.eth.Contract(ArtistNFTAbi, config[environment.configFile][0].artistLootBoxAddress);
    this.LootBoxContractGet = new web3.eth.Contract(lootBoxAbi, config[environment.configFile][0].lootBoxAddress);
    console.log(config[environment.configFile][0].lootBoxAddress)


    await this.getAccountAddress();

    return wallet != undefined || this.account != undefined;
  }

  convertBalance(balance: number): string {
    balance = balance / 1e9;
    balance = Math.trunc(balance);

    return balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  async connectToWallet(origin = 0) {
    const window = this.windowRef.nativeWindow.ethereum;
    var chainId = await this.chainId.value;


    try {
      if (typeof window !== 'undefined' && typeof window !== undefined) {
        await this.windowRef.nativeWindow.ethereum.request({ method: this.ETH_REQUEST_ACCOUNTS });
        this.provider = new ethers.providers.Web3Provider(this.windowRef.nativeWindow.ethereum);

        let currentNetwork = await this.provider.getNetwork();

        if (providerChainID.indexOf(currentNetwork.chainId) === -1) {
          this.toastrService.error('You are on the wrong network1');
          this.setWalletState(false);
          throw 'Wrong network';
        }
        else {
          this.getChainId().subscribe((response) => {
            this.ChainId = response;
          });
          if (this.ChainId != currentNetwork.chainId) {
            this.toastrService.error('You are on the wrong network');
          }
        }


        await this.getAccountAddress();
        this.localStorageService.setWallet(1);
        // Subscribe to accounts change

        this.windowRef.nativeWindow.ethereum.on(this.ACCOUNTS_CHANGED, async (accounts: string[]) => {
          if (accounts.length == 0) {
            // MetaMask is locked or the user has not connected any accounts
            this.setWalletDisconnected();
            this.toastrService.info('Wallet disconnected!');
          } else {
            await this.connectToWallet();
          }
        });

        // Subscribe to session disconnection
        this.windowRef.nativeWindow.ethereum.on(this.CHAIN_CHANGED, async (code: number, reason: string) => {
          await this.connectToWallet();
          this.toastrService.info('You have changed the chain!');
          this.updateSelectedChainId(Number(code));
          location.reload();
          this.setWalletState(true);
        });

        // Subscribe to session disconnection
        this.windowRef.nativeWindow.ethereum.on(this.DISCONNECT, (code: number, reason: string) => {
          // if (provider.close) provider.close();
          this.setWalletDisconnected();
        });

        this.setWalletState(true);

        // if (origin == 0) location.reload();

      }
    } catch (e: any) {
      this.setWalletDisconnected();
    }
  }

  async connectToWalletConnect(origin = 0) {

    const provider = new WalletConnectProvider(providerOptions[this.chainId.value]);

    try {

      this.provider = new ethers.providers.Web3Provider(provider);
      await provider.enable();

      await this.getAccountAddress();
      this.localStorageService.setWallet(2);

      // Subscribe to accounts change
      provider.on(this.ACCOUNTS_CHANGED, (accounts: string[]) => this.connectToWalletConnect());

      // Subscribe to session disconnect
      provider.on(this.DISCONNECT, (code: number, reason: string) => this.setWalletDisconnected());

      // Subscribe to session disconnection
      provider.on(this.CHAIN_CHANGED, (code: number, reason: string) => {
        this.connectToWalletConnect();
        this.setWalletDisconnected();
      });

      this.setWalletState(true);

      if (origin === 0) location.reload();
    }

    catch (e: any) {
      this.setWalletDisconnected();
      location.reload(); // FIXME: Without reloading the page, the WalletConnect modal does not open again after closing it
    }
  }

  async getAccountAddress() {
    this.signer = this.provider.getSigner();
    const address = await this.signer.getAddress();
    const network = await this.provider.getNetwork();
    var chainId = await this.chainId.value;

    this.localStorageService.setAddress(address);
    this.updateSelectedChainId(network.chainId);

    if (network.chainId == chainId) {
      if ((network.chainId == 56 || network.chainId == 97)) {
        this.LootboxContract = new ethers.Contract(LootboxAddress, lootBoxAbi, this.signer);
      }
      this.NFTContract = new ethers.Contract(NFTAddress, NFTAbi, this.signer);
      let index = environment.chainId.indexOf(chainId ?? 56);
      this.artistLootBoxContract = new ethers.Contract(config[environment.configFile][index].artistLootBoxAddress, ArtistNFTAbi, this.signer);
    }

    const data = {
      'provider': this.provider,
      'signer': this.signer,
      'silverContract': this.SilverContract,
      'LootboxContract': this.LootboxContract,
      'nftContract': this.NFTContract,
      'address': address,
      'networkId': network
    }

    this.account = address;
    if (data.address !== undefined)
      this.setWalletState(true);

    this.updateData(data);
  }

  async getDetailsMoonboxPrice() {
    return await this.LootboxContract.moonboxPrice();
  }

  async getDetailsMoonboxlimit(isArtist = false) {
    const promise = new Promise((resolve, reject) => {
      try {

        if (isArtist) {
          this.artistLootBoxContractGet.methods.getMoonShootLimit().call()
            .then((transactionHash: any) => resolve(transactionHash));
        } else {

          this.LootBoxContractGet.methods.getMoonShootLimit().call()
            .then((transactionHash: any) => {
              resolve(transactionHash)
            }
            );
        }
      } catch (e) {
        reject(false);
      }
    });

    return promise;
  }

  async getDetailsLootboxAddress(lootBoxId: any) {
    const promise = new Promise((resolve, reject) => {
      try {
        this.LootboxContract.lootboxPaymentToken(lootBoxId)
          .then((transactionHash: any) => resolve(transactionHash))
      } catch (e) {
        reject(false);
      }
    });

    return promise;
  }

  async getTransactionHashForAllowance(lootBoxId: any, noOfBets: number, userAddress: string) {
    const lootboxPrice = await this.getDetailsMoonboxPrice();

    const promise = new Promise((resolve, reject) => {
      try {
        const params2 = (noOfBets * Number(lootboxPrice) * 1e9).toString();

        this.SilverContract.methods.allowance(userAddress, LootboxAddress).call()
          .then(async (allowanceAmount: string) => {
            if (allowanceAmount >= params2)
              resolve({ hash: '', status: true, allowance: true });
            else
              resolve({ hash: '', status: true, allowance: false });
          });

      } catch (e) {
        reject({ hash: '', status: false });
      }
    });

    return promise;
  }

  async approveSilverToken(lootBoxId: any, noOfBets: number, userAddress: string) {
    const lootboxPrice = await this.getDetailsMoonboxPrice();
    const params = (noOfBets * Number(lootboxPrice) * 1e9).toString();

    const promise = new Promise(async (resolve, reject) => {
      try {
        const tx = await this.SilverContract.methods.approve(LootboxAddress, (params)).call();
        resolve({ hash: tx, status: true, allowance: false });
      } catch (e: any) {
        reject({ hash: '', status: false });
      }
    });
    return promise;
  }

  async getUserBalance(userAddress: string): Promise<number> {
    return Number(await this.SilverContract?.methods.balanceOf(userAddress).call());
  }

  async getTransactionHashForBetSubmit(lootBoxId: any, seed: string, noOfBets: number, userAddress: string) {
    let status: any = await this.getTransactionHashForAllowance(lootBoxId, noOfBets, userAddress);

    if (!status.allowance) {
      await status.hash.wait(1);
      status = await this.redeemBulkTransaction(lootBoxId, seed, noOfBets, userAddress);
    } else if (status.status) {
      status = await this.redeemBulkTransaction(lootBoxId, seed, noOfBets, userAddress);
    }

    return status;
  }

  redeemBulkTransaction(lootBoxId: any, price: any, noOfBets: number, userAddress: string) {

    const promise = new Promise((resolve, reject) => {
      try {
        this.LootboxContract.submitBet(lootBoxId, price, noOfBets, { value: (price * noOfBets).toString() })
          .then((transactionHash: any) => {
            resolve({ hash: transactionHash.hash, status: true });
          }).catch((e: any) => {
            reject({ hash: e, status: false });
          })
      } catch (e) {
        console.log(e);
        reject({ hash: '', status: false });
      }
    });

    return promise;
  }

  async getRedeemBulk(id: any, nftAmount: any, bet: number, signature: any, isArtist: boolean, artistAddress: string, nftAddress: any) {
    const promise = new Promise((resolve, reject) => {
      const spliSign = ethers.utils.splitSignature(signature);
      if (isArtist) {
        try {
          debugger
          this.artistLootBoxContract.redeemBulk(nftAddress, id, nftAmount, artistAddress, bet, spliSign.v, spliSign.r, spliSign.s)
            .then((transactionHash: any) =>
              resolve({ hash: transactionHash.hash, status: true })
            ).catch((e: any) => {
              reject({ hash: e, status: false });
            });
        } catch (e) {
          console.log(e);
          reject({ hash: '', status: false });
        }
      } else {
        try {
          this.LootboxContract.redeemBulk(NFTAddress, id, nftAmount, bet, spliSign.v, spliSign.r, spliSign.s)
            .then((transactionHash: any) => {
              resolve({ hash: transactionHash.hash, status: true });
            }).catch((e: any) => {
              reject({ hash: e, status: false });
            });
        }
        catch (e) {
          console.log(e);
          reject({ hash: '', status: false });
        }
      }
    });

    // address nftAsset, uint256[] calldata id, uint256[] calldata nftAmount, uint256 bet, uint8 v, bytes32 r, bytes32 s
    return promise;
  }



  /** Artist  **/
  async redeemBulkTransactionArtist(lootBoxId: any, noOfBets: any, price: any, artistAddress: string, signature: any, betlimit: number, tokenAddress: string) {
    let params: any = ethers.utils.parseEther(price.toString());
    const spliSign = ethers.utils.splitSignature(signature);
    let callValue: string = "0";
    if (tokenAddress == '0x0000000000000000000000000000000000000000') {
      callValue = (params * noOfBets).toString();
    }
    else {
      let contract = new ethers.Contract(tokenAddress, silverTokenAbi, this.signer);
      let decimals = await contract.decimals();
      params = ((10 ** decimals) * price).toString();
    }

    const promise = new Promise((resolve, reject) => {
      try {

        this.artistLootBoxContract.submitBet(lootBoxId, params, artistAddress, noOfBets, betlimit, tokenAddress, spliSign.v, spliSign.r, spliSign.s, {
          value: callValue
        }
        ).then((transactionHash: any) => {
          resolve({ hash: transactionHash.hash, status: true });
        }).catch((e: any) => {
          reject({ hash: e, status: false });
        });
      } catch (e) {
        reject({ hash: '', status: false });
      }
    });

    return promise;
  }

  updateChainId(data: number): void {
    console.log(data);
    localStorage.setItem('manual_chainId', data.toString());
    console.log(localStorage);
    this.chainId.next(data);

  }

  getChainId(): Observable<number> {
    return this.chainId;
  }

  updateSelectedChainId(data: number): void {
    localStorage.setItem('chainId', data.toString());
    this.selectedChainId.next(data);
  }

  getSelectedChainId(): Observable<number> {
    return this.selectedChainId;
  }

  /** Artist  **/
  async claimRewardTransaction(junkAmount: any, nftId: any, nftAmount: any, betId: any, seed: string, signHash: any) {
    const spliSign = ethers.utils.splitSignature(signHash);
    const params: any = (junkAmount.toString());

    const promise = new Promise(async (resolve, reject) => {
      try {
        const txn = await this.LootboxContract.claimReward(params, NFTAddress, nftId, nftAmount, betId, spliSign.v, spliSign.r, spliSign.s)
          .catch((e: any) => {
            reject({ hash: e, status: false });
          });
        resolve({ hash: txn, status: true });
      } catch (e) {
        reject({ hash: '', status: false });
      }
    });

    return promise;
  }


  async isApproved(address: string) {
    return await this.NFTContract.isApprovedForAll(address, address);
  }

  async setApproval(address: string) {
    return await this.NFTContract.setApprovalForAll(address, true);
  }

  async safeTransfer(address: string, toAddress: string, nftId: any, ArtistNFTAddress: any) {
    let NFTContract = new ethers.Contract(ArtistNFTAddress, NFTAbi, this.signer);

    return await NFTContract.safeTransferFrom(address, toAddress, nftId, 1, '0x00');
  }

  setWalletState(connected: boolean) {
    this.connectedStateSubject.next(connected);
    return this.isConnected;
  }

  onWalletStateChanged() {
    return this.connectedStateSubject.asObservable();
  }

  getAccount() {
    return this.account;
  }

  setWalletDisconnected() {
    this.isConnected = false;
    this.setWalletState(this.isConnected);
    this.account = '';
    this.localStorageService.removeWallet();
  }



  //Token based payments
  async checkAllowance(tokenAddress: any, amount: any) {
    let tokenContract = new ethers.Contract(tokenAddress, silverTokenAbi, this.signer);
    let decimals = await tokenContract.decimals();
    var promise = new Promise((resolve, reject) => {
      try {
        const params2 = (10 ** decimals) * amount;
        tokenContract.allowance(this.account, ArtistNFTAddress)
          .then(async function (allowanceAmount: any) {
            if (allowanceAmount >= params2) {
              resolve({ hash: "", status: true, allowance: true });
            }
            else {
              resolve({ hash: "", status: true, allowance: false })
            }
          })
      }
      catch (e) {
        reject({ hash: e, status: false });
      }
    });
    return promise
  }

  async approveToken(amount: any, tokenAddress: any) {
    let tokenContract = new ethers.Contract(tokenAddress, silverTokenAbi, this.signer);
    let decimals = await tokenContract.decimals();
    const params2 = (10 ** decimals) * amount;

    var promise = new Promise(async (resolve, reject) => {
      try {
        let tx = await tokenContract.approve(ArtistNFTAddress, (params2).toString())


        resolve({ hash: tx, status: true, allowance: false })
      }
      catch (e) {

        reject({ hash: e, status: false });
      }
    });
    return promise
  }


  async buyMSHOT(bnbValue: number) {
    try {

      // if (this.localStorageService.getTokenAdding() === false) {
      //   let hasAdded = await this.addTokenMSHOTv2ToWalletAsset();
      //   console.log(hasAdded);
      // }

      let web3 = new Web3(await web3Modal.connect());
      const buyContract = new web3.eth.Contract(
        buyMshotTokenAbi as any,
        buyContractAddress
      );

      const buyOperation = await buyContract.methods.buyTokenWithBNB();
      let tx = await buyOperation.send(
        {
          from: this.account,
          value: web3.utils.toWei(`${bnbValue}`, "ether")
        }
      );
      // console.log("transaction: ", tx);
      this.toastrService.success('You bought MSHOT successfully!');
    } catch (error) {
      this.toastrService.error('Operation Failed!')
    }
  }

}
