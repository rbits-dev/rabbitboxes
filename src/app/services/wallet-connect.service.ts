import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, Subject, from } from "rxjs";
import { WindowRefService } from "./window-ref.service";
import { ethers, Wallet } from "ethers";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { environment } from "src/environments/environment";
import { ToastrService } from "ngx-toastr";
import { LocalStorageService } from "./local-storage.service";
import Web3 from "web3";
import { debounce } from "lodash";

const SID = require("@siddomains/sidjs").default;
const SIDfunctions = require("@siddomains/sidjs");

const providerChainID = environment.chainId;

const silverTokenAbi = require("./../../assets/abis/silverTokenAbi.json");
const lootBoxAbi = require("./../../assets/abis/lootBoxAbi.json");
const swapContractAbi = require("./../../assets/abis/swapContractAbi.json");
const NFTAbi = require("./../../assets/abis/NFTAbi.json");
const BRIDGE_ABI = require("./../../assets/abis/BridgeAbi.json");
const BRIDGE_COLLECTION_ABI = require("./../../assets/abis/BridgeCollectionAddressAbi.json");
const ArtistNFTAbi = require("./../../assets/abis/ArtistNFTAbi.json");
const registorAbi = require("../../assets/abis/registorAbi.json");
const config = require("./../../assets/configFiles/configFile.json");
const MINT_NFT_ABI = require("./../../assets/abis/mintNFTAbi.json");
const ERC721ABI = require("./../../assets/abis/ERC721ABI.json");

import { CHAIN_CONFIGS } from "../components/base/wallet/connect/constants/blockchain.configs";

const providerOptionsForRBITS = {
  walletconnect: {
    package: WalletConnectProvider,
    rpc: {},
    network: CHAIN_CONFIGS[providerChainID[0]]?.name || "Unknown", // Default to unknown
    chainId: providerChainID[0], // first chain id is the default
  },
};

// allow WalletConnectProvider to know which RPC endpoints to use for each supported network
providerChainID.forEach((supportedChainId) => {
  providerOptionsForRBITS.walletconnect.rpc[supportedChainId] =
    supportedChainId == 1 || supportedChainId == 11155111
      ? CHAIN_CONFIGS[supportedChainId]?.rpcUrls[0]
      : CHAIN_CONFIGS[supportedChainId]?.config.params[0].rpcUrls[0];
});

// const web3Modal = new Web3Modal({
//   theme: "dark",
//   cacheProvider: false,
//   providerOptions: providerOptionsForRBITS,
//   disableInjectedProvider: false,
// });

@Injectable({
  providedIn: "root",
})
export class WalletConnectService {
  chainId: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  private selectedChainId: BehaviorSubject<number> = new BehaviorSubject<
    number
  >(0);

  public $timerUp = new BehaviorSubject({});

  private readonly ACCOUNTS_CHANGED: string = "accountsChanged";
  private readonly CHAIN_CHANGED: string = "chainChanged";
  private readonly DISCONNECT: string = "disconnect";
  private readonly ETH_REQUEST_ACCOUNTS: string = "eth_requestAccounts";

  public data = new Subject<any>();
  private connectedStateSubject = new Subject<boolean>();
  public tokenomicsData: any;
  public oldPancakeAddress = true;
  private isConnected = false;
  private account = "";
  chainConfigs = CHAIN_CONFIGS;
  provider: ethers.providers.Web3Provider;
  signer: ethers.providers.JsonRpcSigner;
  SilverContract: any;
  LootboxContract: any;
  NFTContract: any;
  artistLootBoxContract: any;
  artistLootBoxContractGet: any;
  LootBoxContractGet: any;
  swapContract: any;
  BridgeContract: any;
  BridgeCollectionContract: any;
  ChainId: number = 0;
  registorContractAddressObj: any;
  constructor(
    private windowRef: WindowRefService,
    private toastrService: ToastrService,
    private localStorageService: LocalStorageService
  ) {}

  updateData(state: any) {
    this.tokenomicsData = state;
    this.data.next(state);
  }

  getData(): Observable<any> {
    return this.data.asObservable();
  }

  initTokenCA() {
    // Token is on ETH
    let providerRPC = this.chainConfigs[1].rpcUrls[0];
    var web3Provider = new Web3.providers.HttpProvider(providerRPC);
    var web3 = new Web3(web3Provider);
    this.SilverContract = new web3.eth.Contract(
      silverTokenAbi,
      environment.tokenContractAddress
    );
  }

  async init(): Promise<boolean> {
    try {
      var web3Provider = new Web3.providers.HttpProvider(
        environment.providerURL
      );
      var web3 = new Web3(web3Provider);

      this.LootBoxContractGet = new web3.eth.Contract(
        lootBoxAbi,
        environment.lootBoxAddress
      );

      this.swapContract = new web3.eth.Contract(
        swapContractAbi,
        config[environment.configFile][1].ArtistMoonBoxNftSwap
      );

      //MultiChain contracts
      this.artistLootBoxContractGet = new web3.eth.Contract(
        ArtistNFTAbi,
        config[environment.configFile][1].artistLootBoxAddress
      );
    } catch (e) {
      console.log("An error occured", e);
    }

    this.initTokenCA();

    const wallet = this.localStorageService.getWallet();
    switch (wallet) {
      case 1:
        await this.connectToWallet(wallet);
        break;
      case 2:
        await this.connectToWalletConnect(wallet);
        break;
      default:
        break;
    }

    //await this.getAccountAddress();

    return wallet != undefined || this.account != undefined;
  }

  convertBalance(balance: number): string {
    balance = balance / 1e9;
    balance = Math.trunc(balance);

    return balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  async isValidAddress() {
    try {
      let address = await this.signer?.getAddress();
      return ethers.utils.isAddress(address);
    } catch (error) {
      return false;
    }
  }

  async connectToWallet(origin = 0) {
    const window = this.windowRef.nativeWindow.ethereum;

    try {
      if (typeof window !== "undefined" && typeof window !== undefined) {
        await this.windowRef.nativeWindow.ethereum.request({
          method: this.ETH_REQUEST_ACCOUNTS,
        });
        this.provider = new ethers.providers.Web3Provider(
          this.windowRef.nativeWindow.ethereum
        );

        let currentNetwork = await this.provider.getNetwork();

        this.getChainId().subscribe((currentChainId) => {
          if (currentChainId === 0) {
            currentChainId = currentNetwork.chainId;
          }

          if (providerChainID.indexOf(currentNetwork.chainId) === -1) {
            this.toastrService.error(
              "You are on an unsupported network, please select another blockchain."
            );
            this.setWalletState(false);
            throw "Wrong network";
          }

          this.ChainId = currentChainId;
          this.selectedChainId.next(currentChainId);

          localStorage.setItem("manual_chainId", this.ChainId.toString());
        });

        if (providerChainID.indexOf(currentNetwork.chainId) === -1) {
          this.setWalletState(false);
          this.ChainId = 1;
          this.selectedChainId.next(1);

          throw "Wrong network";
        } /*else {
          if (this.ChainId != currentNetwork.chainId) {
            this.toastrService.error(
              "You are on the wrong network, please connect with " +
                this.chainConfigs[this.ChainId]?.name ?? ""
            );

            this.setWalletDisconnected();
            setTimeout( () => {
              location.reload();
            }, 3000);
          }
        } */

        localStorage.setItem("manual_chainId", this.ChainId.toString());
        this.chainId.next(this.ChainId);

        // Subscribe to accounts change

        this.windowRef.nativeWindow.ethereum.on(
          this.ACCOUNTS_CHANGED,
          async (accounts: string[]) => {
            if (accounts.length == 0) {
              // MetaMask is locked or the user has not connected any accounts
              this.toastrService.info("Wallet disconnected!");
              this.setWalletDisconnected();

              location.reload();
            } else {
              await this.connectToWallet();
            }
          }
        );

        // Subscribe to network changed event
        this.windowRef.nativeWindow.ethereum.on(
          this.CHAIN_CHANGED,
          debounce(async (code: number, reason: string) => {
            await this.connectToWallet();
            this.toastrService.info("Network change detected, please wait");
            setTimeout(() => {
              location.reload();
            }, 3000);
            // alert(code)
            this.updateSelectedChainId(Number(code));
            this.setWalletState(true);
          }, 3000) // Debounce for 1 second
        );

        // Subscribe to session disconnection
        this.windowRef.nativeWindow.ethereum.on(
          this.DISCONNECT,
          (code: number, reason: string) => {
            // if (provider.close) provider.close();
            this.setWalletDisconnected();
            window.location.reload();
          }
        );

        this.setWalletState(true);
        await this.getAccountAddress();
        this.localStorageService.setWallet(1);

        // if (origin == 0) location.reload();
      }
    } catch (e) {
      console.log(e);
      this.setWalletDisconnected();
    }
  }

  async connectToWalletConnect(origin = 0) {
    try {
      const provider = new WalletConnectProvider({
        rpc: {
          1: "https://eth-mainnet.public.blastapi.io",
          56: "https://bsc-dataseed.binance.org",
          137: "https://polygon.llamarpc.com",
          1285: "https://rpc.api.moonriver.moonbeam.network",
          11155111: "https://ethereum-sepolia-rpc.publicnode.com",
        },
      });
      await provider
        .enable()
        .then(() => console.log("first call resolved"))
        .catch(() => provider.disconnect());
      try {
        this.provider = new ethers.providers.Web3Provider(provider);
        await provider.enable();

        let currentNetwork = await this.provider.getNetwork();

        this.getChainId().subscribe((currentChainId) => {
          if (currentChainId === 0) {
            currentChainId = currentNetwork.chainId;
          }

          if (providerChainID.indexOf(currentNetwork.chainId) === -1) {
            this.toastrService.error(
              "You are on an unsupported network, please select another blockchain"
            );
            this.setWalletState(false);
            throw "Wrong network";
          }

          this.ChainId = currentChainId;
          this.selectedChainId.next(currentChainId);

          localStorage.setItem("manual_chainId", this.ChainId.toString());
        });

        // Subscribe to accounts change
        provider.on(this.ACCOUNTS_CHANGED, (accounts: string[]) =>
          this.connectToWalletConnect()
        );

        // Subscribe to session disconnect
        provider.on(this.DISCONNECT, (code: number, reason: string) => {
          this.setWalletDisconnected();
          this.toastrService.info("Wallet disconnected!");
          location.reload();
        });

        // Subscribe to network change event
        provider.on(
          this.CHAIN_CHANGED,
          async (code: number, reason: string) => {
            this.connectToWalletConnect();
            this.setWalletDisconnected();

            let currentNetwork = await this.getNetworkChainId();
            this.ChainId = currentNetwork as number;

            localStorage.setItem("manual_chainId", this.ChainId.toString());
            this.chainId.next(this.ChainId);

            this.updateSelectedChainId(
              environment.chainId.indexOf(currentNetwork as number)
            );
          }
        );

        this.setWalletState(true);

        await this.getAccountAddress();
        this.localStorageService.setWallet(2);

        if (origin === 0) location.reload();
      } catch (e) {
        console.log("There was an error", e);
        this.setWalletDisconnected();
        location.reload(); // FIXME: Without reloading the page, the WalletConnect modal does not open again after closing it
      }
    } catch (error) {
      console.log(error);
    }
  }

  async getAccountAddress() {
    this.signer = this.provider?.getSigner();
    const address = await this.signer?.getAddress();
    const network = await this.provider?.getNetwork();
    var chainId = this.chainId.value;

    this.localStorageService.setAddress(address);

    const node = config[environment.configFile].find(
      (chain: any) => chain.chainId == chainId
    );
    if (node === undefined) {
      console.log("Error: No configuration data found for chain ", chainId);
    }

    if (node) {
      try {
        if (chainId == 56 || chainId == 97) {
          this.NFTContract = new ethers.Contract(
            environment.NFTAddress,
            NFTAbi,
            this.signer
          );

          //FIXME: NFTContract should be defined in configuration file
        }

        if (node.lootBoxAddress) {
          this.LootboxContract = new ethers.Contract(
            node.lootBoxAddress,
            lootBoxAbi,
            this.signer
          );
        }

        if (node.ArtistMoonBoxNftSwap) {
          this.swapContract = new ethers.Contract(
            node.ArtistMoonBoxNftSwap,
            swapContractAbi,
            this.signer
          );
        }

        if (node.BridgeNftAddress) {
          this.BridgeContract = new ethers.Contract(
            node.BridgeNftAddress,
            BRIDGE_ABI,
            this.signer
          );
        }

        // if( node.bridgeCollectionAddress ) {
        //   this.BridgeCollectionContract = new ethers.Contract(
        //     node.bridgeCollectionAddress,
        //     BRIDGE_COLLECTION_ABI,
        //     this.signer
        //   );
        // }

        if (node.artistLootBoxAddress) {
          this.artistLootBoxContract = new ethers.Contract(
            node.artistLootBoxAddress,
            ArtistNFTAbi,
            this.signer
          );
        }

        if (node.RegisterMoonboxAddress) {
          this.registorContractAddressObj = new ethers.Contract(
            node.RegisterMoonboxAddress,
            registorAbi,
            this.signer
          );
        }
      } catch (e) {
        console.log(e);
      }
    }

    const data = {
      provider: this.provider,
      signer: this.signer,
      silverContract: this.SilverContract,
      LootboxContract: this.LootboxContract,
      nftContract: this.NFTContract,
      address: address,
      networkId: network,
    };

    this.account = address;
    if (data.address !== undefined) this.setWalletState(true);

    this.updateData(data);

    console.log(data);
  }

  sid: any;

  async spaceAddress(address: any) {
    try {
      let chainId: any = this.ChainId;
      if (chainId != 56) {
        console.log("No ENS lookup for chain ", chainId);
        return address; //spaceID on BSC
      }

      let rpc =
        chainId == 1 || chainId == 11155111
          ? this.chainConfigs[chainId].rpcUrls[0]
          : this.chainConfigs[chainId].config.params[0].rpcUrls[0];
      const provider = new Web3.providers.HttpProvider(rpc);

      this.sid = new SID({
        provider,
        sidAddress: SIDfunctions.getSidAddress(chainId),
      });

      return await this.sid.getName(address);
    } catch (error) {
      console.log(error);
    }
  }

  async registorCheck(data: {
    name: string;
    symbol: string;
    username: string;
    collectionName: string;
    walletAddress: string;
  }) {
    try {
      let transaction = await this.registorContractAddressObj.register(
        environment.lootBoxAddress,
        data.name,
        data.collectionName,
        data.symbol,
        data.username,
        data.walletAddress
      );
      return { status: true, hash: transaction };
    } catch (error) {
      this.toastrService.error(error.message);
      return { status: false, hash: "" };
    }
  }

  async getDetailsMoonboxPrice() {
    return await this.LootboxContract.moonboxPrice();
  }

  async getNetworkChainId() {
    if (this.account == undefined) return environment.chainId;
    let provider = new ethers.providers.Web3Provider(
      this.windowRef.nativeWindow.ethereum
    );
    return (await provider.getNetwork()).chainId;
  }

  async getDetailsMoonboxlimit(isArtist = false) {
    const promise = new Promise((resolve, reject) => {
      try {
        if (isArtist) {
          this.artistLootBoxContractGet.methods
            .getRabbitShootLimit()
            .call()
            .then((transactionHash: any) => resolve(transactionHash));
        } else {
          this.LootBoxContractGet.methods
            .getMoonShootLimit()
            .call()
            .then((transactionHash: any) => {
              resolve(transactionHash);
            });
        }
      } catch (e) {
        console.log(e);
        reject(false);
      }
    });

    return promise;
  }

  async getDetailsLootboxAddress(lootBoxId: any) {
    const promise = new Promise((resolve, reject) => {
      try {
        this.LootboxContract.lootboxPaymentToken(
          lootBoxId
        ).then((transactionHash: any) => resolve(transactionHash));
      } catch (e) {
        reject(false);
      }
    });

    return promise;
  }

  async getTransactionHashForAllowance(
    lootBoxId: any,
    noOfBets: number,
    userAddress: string
  ) {
    const lootboxPrice = await this.getDetailsMoonboxPrice();

    const promise = new Promise((resolve, reject) => {
      try {
        const params2 = (noOfBets * Number(lootboxPrice) * 1e9).toString();

        this.SilverContract.methods
          .allowance(userAddress, environment.lootBoxAddress)
          .call()
          .then(async (allowanceAmount: string) => {
            if (allowanceAmount >= params2)
              resolve({ hash: "", status: true, allowance: true });
            else resolve({ hash: "", status: true, allowance: false });
          });
      } catch (e) {
        reject({ hash: "", status: false });
      }
    });

    return promise;
  }

  async approveSilverToken(
    lootBoxId: any,
    noOfBets: number,
    userAddress: string
  ) {
    const lootboxPrice = await this.getDetailsMoonboxPrice();
    const params = (noOfBets * Number(lootboxPrice) * 1e9).toString();

    const promise = new Promise(async (resolve, reject) => {
      try {
        const tx = await this.SilverContract.methods
          .approve(environment.lootBoxAddress, params)
          .call();
        resolve({ hash: tx, status: true, allowance: false });
      } catch (e) {
        reject({ hash: "", status: false });
      }
    });
    return promise;
  }


  async getUserBalance(addr) {
    try {
      const web3 = new Web3(CHAIN_CONFIGS[1].rpcUrls[0]);
      const RBITS = environment.tokenContractAddress
      const abi = [
        {
            "constant": true,
            "inputs": [
                {
                    "name": "_owner",
                    "type": "address"
                }
            ],
            "name": "balanceOf",
            "outputs": [
                {
                    "name": "balance",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
      ];
  
      const rabbitContract = new web3.eth.Contract(abi as any, RBITS);
      const rabbitsBalance = await rabbitContract.methods.balanceOf(addr).call();

      return Number(rabbitsBalance);

    } catch (e) {
      console.log("Unable to get balance:", e);
    }

    return Number(0);
  }
/*
  async getUserBalance(userAddress: string): Promise<number> {
    if (this.ChainId != 1) {
      return Number(0); // RBITS token is only deployed on ETH
    }

    let num = await this.SilverContract?.methods.balanceOf(userAddress).call();

    return Number(num);
  }
*/

  async getTransactionHashForBetSubmit(
    lootBoxId: any,
    seed: string,
    noOfBets: number,
    userAddress: string
  ) {
    let status: any = await this.getTransactionHashForAllowance(
      lootBoxId,
      noOfBets,
      userAddress
    );

    if (!status.allowance) {
      await status.hash.wait(1);
      status = await this.redeemBulkTransaction(
        lootBoxId,
        seed,
        noOfBets,
        userAddress
      );
    } else if (status.status) {
      status = await this.redeemBulkTransaction(
        lootBoxId,
        seed,
        noOfBets,
        userAddress
      );
    }

    return status;
  }

  async redeemBulkTransaction(
    lootBoxId: any,
    price: any,
    noOfBets: number,
    userAddress: string
  ) {
    //

    try {
      //
      let txn: any = await this.LootboxContract.submitBet(
        lootBoxId,
        price,
        noOfBets,
        {
          value: (price * noOfBets).toString(),
          gasLimit: 1000000000000000,
          gasPrice: 110,
        }
      );
      return { hash: txn.hash, status: true };
    } catch (e) {
      console.log(e);
      return { hash: "", status: false, error: e };
    }
  }

  async getRedeemBulk(
    id: any,
    nftAmount: any,
    bet: number,
    signature: any,
    isArtist: boolean,
    artistAddress: string,
    nftAddress: any
  ) {
    const spliSign = ethers.utils.splitSignature(signature);
    if (isArtist) {
      try {

        let txn: any = await this.artistLootBoxContract.redeemBulk(
          nftAddress,
          id,
          nftAmount,
          artistAddress,
          bet,
          spliSign.v,
          spliSign.r,
          spliSign.s
        );
        await txn.wait(1);
        return { hash: txn.hash, status: true };
      } catch (e) {
        this.toastrService.error(e.reason);
        return { hash: "", status: false, error: e };
      }
    } else {
      try {
        let txn: any = await this.LootboxContract.redeemBulk(
          environment.NFTAddress,
          id,
          nftAmount,
          bet,
          spliSign.v,
          spliSign.r,
          spliSign.s
        );
        await txn.wait(1);
        return { hash: txn.hash, status: true };
      } catch (e) {
        console.log(e);
        this.toastrService.error(e.reason);
        return { hash: "", status: false, error: e };
      }
    }

    // address nftAsset, uint256[] calldata id, uint256[] calldata nftAmount, uint256 bet, uint8 v, bytes32 r, bytes32 s
  }

  /** Artist  **/
  async redeemBulkTransactionArtist(
    lootBoxId: any,
    noOfBets: any,
    price: any,
    artistAddress: string,
    signature: any,
    betlimit: number,
    tokenAddress: string
  ) {
    let params: any = ethers.utils.parseEther(price.toString());
    const spliSign = ethers.utils.splitSignature(signature);
    let callValue: string = "0";
    let gas = 0;
    if (tokenAddress == "0x0000000000000000000000000000000000000000") {
      callValue = (params * noOfBets).toString();
    } else {
      let contract = new ethers.Contract(
        tokenAddress,
        silverTokenAbi,
        this.signer
      );
      let decimals = await contract.decimals();
      params = (10 ** decimals * price).toString();
    }
    try {
      //
      gas = await this.artistLootBoxContract.estimateGas.submitBet(
        lootBoxId,
        params,
        artistAddress,
        noOfBets,
        betlimit,
        tokenAddress,
        spliSign.v,
        spliSign.r,
        spliSign.s,
        {
          value: callValue,
        }
      );
    } catch (e) {
      gas = 1000000;
    }

    try {
      //
      let txn: any = await this.artistLootBoxContract.submitBet(
        lootBoxId,
        params,
        artistAddress,
        noOfBets,
        betlimit,
        tokenAddress,
        spliSign.v,
        spliSign.r,
        spliSign.s,
        {
          value: callValue,
          // gasPrice: 100,
          gasLimit: gas,
        }
      );
      await txn.wait(1);
      return { hash: txn.hash, status: true };
    } catch (e) {
      return { hash: "", status: false, error: e };
    }
  }

  updateChainId(data: number): void {
    localStorage.setItem("manual_chainId", data.toString());
    this.chainId.next(data);
    this.selectedChainId.next(data);
  }

  getChainId(): Observable<number> {
    return this.chainId;
  }

  updateSelectedChainId(data: number): void {
    localStorage.setItem("chainId", data?.toString());
    this.selectedChainId.next(data);
  }

  getSelectedChainId(): Observable<number> {
    return this.selectedChainId;
  }

  /** Artist  **/
  async claimRewardTransaction(
    junkAmount: any,
    nftId: any,
    nftAmount: any,
    betId: any,
    seed: string,
    signHash: any
  ) {
    const spliSign = ethers.utils.splitSignature(signHash);
    const params: any = junkAmount.toString();

    const promise = new Promise(async (resolve, reject) => {
      try {
        const txn = await this.LootboxContract.claimReward(
          params,
          environment.NFTAddress,
          nftId,
          nftAmount,
          betId,
          spliSign.v,
          spliSign.r,
          spliSign.s
        ).catch((e: any) => {
          reject({ hash: e, status: false });
        });
        resolve({ hash: txn, status: true });
      } catch (e) {
        reject({ hash: "", status: false });
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

  async safeTransfer(
    address: String,
    toAddress: String,
    nftId: any,
    ArtistNFTAddress: any,
    contractStandard :any
  ) {
    try {
      if(contractStandard ==0){

        let NFTContract = new ethers.Contract(
          ArtistNFTAddress,
          NFTAbi,
          this.signer
        );
        var txn = await NFTContract.safeTransferFrom(
          address,
          toAddress,
          nftId,
          1,
          "0x00"
        );
        await txn.wait(1);
      }else{


        let NFTContract = new ethers.Contract(
          ArtistNFTAddress,
          ERC721ABI,
          this.signer
        );
        var txn = await NFTContract.transferFrom(
          address,
          toAddress,
          nftId
        );
        await txn.wait(1);
      }

      return txn
    } catch (e) {
      throw e
    }
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

  getWalletState() {
    return this.isConnected;
  }

  setWalletDisconnected() {
    this.isConnected = false;
    this.setWalletState(this.isConnected);
    this.account = "";
    this.localStorageService.removeWallet();
  }

  //Token based payments
  async checkAllowance(tokenAddress: any, amount: any) {
    let tokenContract = new ethers.Contract(
      tokenAddress,
      silverTokenAbi,
      this.signer
    );
    let decimals = await tokenContract.decimals();
    var promise = new Promise((resolve, reject) => {
      try {
        const params2 = 10 ** decimals * amount;
        tokenContract
          .allowance(this.account, environment.artistNFTAddress)
          .then(async function (allowanceAmount: any) {
            if (allowanceAmount >= params2) {
              resolve({ hash: "", status: true, allowance: true });
            } else {
              resolve({ hash: "", status: true, allowance: false });
            }
          });
      } catch (e) {
        reject({ hash: e, status: false });
      }
    });
    return promise;
  }

  async approveToken(amount: any, tokenAddress: any) {
    let tokenContract = new ethers.Contract(
      tokenAddress,
      silverTokenAbi,
      this.signer
    );
    let decimals = await tokenContract.decimals();
    const params2 = 10 ** decimals * amount;

    var promise = new Promise(async (resolve, reject) => {
      try {
        let tx = await tokenContract.approve(
          environment.artistNFTAddress,
          params2.toString()
        );

        resolve({ hash: tx, status: true, allowance: false });
      } catch (e) {
        reject({ hash: e, status: false });
      }
    });
    return promise;
  }

  async migrateNft(newNftAsset: any, id: any, nftAmount: any, signature: any) {
    const spliSign = ethers.utils.splitSignature(signature);
    const promise = new Promise((resolve, reject) => {
      try {
        this.swapContract
          .swap(newNftAsset, id, nftAmount, spliSign.v, spliSign.r, spliSign.s)
          .then((transactionHash: any) => {
            resolve({ hash: transactionHash.hash, status: true });
          })
          .catch((e: any) => {
            reject({ hash: e, status: false });
          });
      } catch (e) {
        console.log(e);
        reject({ hash: "", status: false });
      }
    });

    return promise;
  }

  async isApprovedMigration(address: string) {
    var chainId = await this.chainId.value;
    let index = environment.chainId.indexOf(chainId ?? 56);
    return await this.NFTContract.isApprovedForAll(
      address,
      config[environment.configFile][index].ArtistMoonBoxNftSwap
    );
  }

  async setApprovalMigration() {
    var chainId = this.chainId.value;
    let index = environment.chainId.indexOf(chainId ?? 56);
    return await this.NFTContract.setApprovalForAll(
      config[environment.configFile][index].ArtistMoonBoxNftSwap,
      true
    );
  }

  //SET APROVAL FOR BRIDGE NFT
  async setApprovalBridgeNFT(contractAddress: string) {
    //var chainId = this.chainId.value;
    //let index = environment.chainId.indexOf(chainId ?? 56);

    const node = config[environment.configFile].find(
      (chain: any) => chain.chainId == this.chainId.value
    );
    if (node.BridgeNftAddress === undefined) {
      console.log(
        "Error: BridgeNftAddress not set for chain ",
        this.chainId.value
      );
    }
    this.BridgeCollectionContract = new ethers.Contract(
      contractAddress,
      BRIDGE_COLLECTION_ABI,
      this.signer
    );

    return await this.BridgeCollectionContract.setApprovalForAll(
      node.BridgeNftAddress,
      true
    );
  }
  //CHECK APROVAL FOR BRIDGE NFT
  async isApprovalBridgeNFT(contractAddress: string) {
    //var chainId = this.chainId.value;
    //let index = environment.chainId.indexOf(chainId ?? 56);
    //let address = config[environment.configFile][index].BridgeNftAddress;

    const node = config[environment.configFile].find(
      (chain: any) => chain.chainId == this.chainId.value
    );
    // if (node.bridgeCollectionAddress === undefined) {
    //   console.error(
    //     "Error: bridgeCollectionAddress not set for chain ",
    //     this.chainId.value
    //   );
    // }
    if (node.destination === undefined) {
      console.error(
        "Error: destination not set for chain ",
        this.chainId.value
      );
    }

    this.BridgeCollectionContract = new ethers.Contract(
      contractAddress,
      BRIDGE_COLLECTION_ABI,
      this.signer
    );

    return await this.BridgeCollectionContract.isApprovedForAll(
      this.account,
      node.BridgeNftAddress
    );
  }

  //ESTIMATE FEES
  async estimateFees({
    EndpointId,
    destination,
    userAddress,
    tokenIds,
    amounts,
    srcContract,
    destContract,
    sign,
  }) {
    try {
      const abi = new ethers.utils.AbiCoder();
      const payload = abi.encode(
        [
          "address",
          "uint256[]",
          "uint256[]",
          "bytes",
          "address",
          "address",
          "(uint8,bytes32,bytes32,uint256)",
        ],
        [
          userAddress,
          tokenIds,
          amounts,
          destination,
          srcContract,
          destContract,
          sign,
        ]
      );
      const adapterParams = ethers.utils.solidityPack(
        ["uint16", "uint256"],
        [1, 350000]
      );
      const contractAddress =
        config[environment.configFile][1].BridgeNftAddress;
      const value = await this.BridgeContract.estimateFees(
        EndpointId,
        contractAddress,
        payload,
        false,
        adapterParams
      );

      return value;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  //HANDLE BRIDGE NFT
  async bridgeNFT(
    tokenIds,
    amounts,
    userAddress,
    srcContract,
    destContract,
    signature,
    fromChain
  ) {
    try {
      const node = config[environment.configFile].find(
        (chain: any) => chain.chainId == this.chainId.value
      );
      if (node.destination === undefined) {
        console.error(
          "Error: destinationAddress not set for chain ",
          this.chainId.value
        );
      }

      let EndpointId = fromChain == 1 ? node.destChainId : node.destChainIdBase;
      let destination =
        fromChain == 1 ? node.destination : node.destinationBase;
      let sign = [signature.v, signature.r, signature.s, signature.nonce];

      const calculatedFees = await this.estimateFees({
        EndpointId,
        destination,
        userAddress,
        tokenIds,
        amounts,
        srcContract,
        destContract,
        sign,
      });

      // Calculate 10% extra fee
      const extraFee = Math.ceil(Number(calculatedFees.nativeFee) * 0.15);
      const totalFees = (Number(calculatedFees.nativeFee) + extraFee)
      // Convert fees to hexadecimal format
      const hexFees = ethers.utils.parseUnits(totalFees.toString(), "wei");
      // Call the crossChain function with the calculated fees including 10% extra
      let txn = await this.BridgeContract.crossChain(
        EndpointId,
        destination,
        tokenIds,
        amounts,
        srcContract,
        destContract,
        sign,
        { value: hexFees } // Pass fees as value object
      );
      return txn;
    } catch (error) {
      throw error;
    }
  }
  //LISTEN TO EVENTS OF MINT NFT CONTRACT
  async listenToEvents(fromChain) {
    let provider;
    let providerIndex = 0;
    let providerURLForEth = this.chainConfigs[environment.chainId[0]].rpcUrls;
    while (!provider && providerIndex < providerURLForEth.length) {
      try {
        provider = new ethers.providers.JsonRpcProvider(
          providerURLForEth[providerIndex]
        );
        await provider.getBlockNumber(); // Test if provider is working
      } catch (error) {
        console.error(`JSON-RPC provider at index ${providerIndex} failed.`);
        provider = null; // Reset provider to try the next one
        providerIndex++;
      }
    }

    if (!provider) {
      this.toastrService.error(
        "something went wrong please check on explorer your nft successfully bridge!!"
      );
      throw new Error("All JSON-RPC providers failed.");
    }
    console.log(
      "listenevent on",
      fromChain == 1
        ? environment.rabbitControllerAddress[0]
        : environment.rabbitControllerAddress[1]
    );

    const contract = new ethers.Contract(
      fromChain == 1
        ? environment.rabbitControllerAddress[0]
        : environment.rabbitControllerAddress[1],
      MINT_NFT_ABI,
      provider
    );
    return new Promise((resolve, reject) => {
      contract.on("ReceiveNFT", (from, to, id, amount, event) => {
        console.log("event detected===========>", event);
        resolve(event);
      });
    });
  }

  //HANDLE METAMSK ERROR
  async handleMetamaskError(error) {
    switch (error.code) {
      case "UNPREDICTABLE_GAS_LIMIT":
        this.toastrService.error(error.reason);
        break;
      case "ACTION_REJECTED":
        this.toastrService.error(error.reason);
        break;
      case -32602:
        this.toastrService.error(
          "Please check if the network configuration in your wallet is correct"
        );
        break;
      case -32603:
      case "OUT_OF_GAS":
        this.toastrService.error(
          "You don't have enough to cover the gas fees."
        );
        break;
      default:
        this.toastrService.error(
          "Something went wrong, please try again later."
        );
        break;
    }
  }

  async printError(errorMsg) {
    this.toastrService.error(errorMsg);
  }
}
