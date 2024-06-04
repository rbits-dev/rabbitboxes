import { Component, ChangeDetectorRef, OnInit, Inject } from "@angular/core";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from "@angular/material/dialog";

import { BridgeTransactionStatusDialogComponent } from "../bridge-transaction-status-dialog/bridge-transaction-status-dialog.component";
import { HttpApiService } from "src/app/services/http-api.service";
import { HttpHeaders, HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-upgrade-nft-dialog",
  templateUrl: "./upgrade-nft-dialog.component.html",
  styleUrls: ["./upgrade-nft-dialog.component.scss"],
})
export class UpgradeNftDialogComponent implements OnInit {
  isLoading = false;
  isSelectAll = true;
  cursor = null;
  tokenIds = [];
  amounts = [];
  bridgeNftBtnTxt = "Bridge NFT";
  userAddress: string;
  nftListData = [];
  baseUrl: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public nftList: any,
    public dialogRef: MatDialogRef<UpgradeNftDialogComponent>,
    private openDialog: MatDialog,
    private httpApi: HttpApiService,
    private cd: ChangeDetectorRef,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.userAddress = localStorage.getItem("address");
    this.cursor = this.nftList.nftData.cursor;
    this.nftListData = this.nftList.nftData.result;
    this.getMetaData();
  }

  async getMetaData() {
    try {
      this.isLoading = true;
      this.baseUrl = await this.httpApi.getMetadataUrl();
      for (let item of this.nftListData) {
        item.isSelected = true;
        this.tokenIds.push(item.token_id);
        this.amounts.push(item.amount);
        try {
          const result: any = await this.httpApi.getTokenUriData(
            item.token_id,
            this.baseUrl.baseUrl
          );
          item.image_path = result.image;
          item.nftName = result.name;
        } catch (error) {
          console.log(error);
        }

        this.cd.detectChanges();
      }
      this.isLoading = false;
    } catch (error) {
      this.isLoading = false;
      console.log(error);
    }
  }

  // Function to fetch NFTs for a specific contract
  async fetchNFTsForContract(): Promise<any> {
    try {
      this.isLoading = true;
      const headers = new HttpHeaders()
        .set("Content-Type", "application/json")
        .set(
          "X-API-Key",
          "mPiHvsoVqeqlQTF6FkXslLhgtTgL3OKDrsp29tQPHDtyOKyuj5GlMCIfWKtOfOPC"
        );
      const apiUrl = `https://deep-index.moralis.io/api/v2/${this.userAddress}/nft/${this.nftList.srcContractAddress}?chain=${environment.moralisChain}&format=decimal&cursor=${this.cursor}&limit=20`;
      var res: any = await this.http
        .get(apiUrl, { headers: headers })
        .toPromise();
      this.cursor = res.cursor;
      for (let item of res.result) {
        if (this.isSelectAll) {
          item.isSelected = true;
          this.tokenIds.push(item.token_id);
          this.amounts.push(item.amount);
        }
        try {
          const result: any = await this.httpApi.getTokenUriData(
            item.token_id,
            this.baseUrl.baseUrl
          );
          item.image_path = result.image;
          item.nftName = result.name;
        } catch (error) {
          console.log(error);
        }
        this.cd.detectChanges();
      }
      this.nftListData = [...this.nftListData, ...res.result];
      this.isLoading = false;
    } catch (error) {
      this.isLoading = false;
    }
  }

  // HANDLE SELECT ALL CHANGE FN
  handleOnChange(event) {
    this.isSelectAll = event.target.checked;
    for (let item of this.nftListData) {
      item.isSelected = event.target.checked;
      if (item.isSelected) {
        this.tokenIds.push(item.token_id);
        this.amounts.push(item.amount);
      } else {
        this.tokenIds = [];
        this.amounts = [];
      }
    }
  }

  // HANDLE SINGLE CHANGE FN
  handleSingleChange(event, index) {
    this.nftListData[index].isSelected = event.target.checked;
    this.isSelectAll = this.nftListData.every((item) => item.isSelected);
    // Filter out unselected items from tokenIds and amounts arrays
    this.tokenIds = this.nftListData
      .filter((item) => item.isSelected)
      .map((item) => item.token_id);
    this.amounts = this.nftListData
      .filter((item) => item.isSelected)
      .map((item) => item.amount);
  }

  //handle bridge nft status dialog
  openBridgeNftStatusDialog(srcContract: string, destContract: string) {
    this.openDialog.open(BridgeTransactionStatusDialogComponent, {
      width: "500px",
      data: {
        tokenIds: this.tokenIds,
        amounts: this.amounts,
        srcContract: srcContract,
        destContract: destContract,
        fromChain: this.nftList.fromChain,
      },
      disableClose: true,
    });
  }
}
