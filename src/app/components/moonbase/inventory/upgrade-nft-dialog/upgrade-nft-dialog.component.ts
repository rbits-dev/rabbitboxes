import { Component, OnInit, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { HttpApiService } from "src/app/services/http-api.service";
import { LocalStorageService } from "src/app/services/local-storage.service";
import { WalletConnectService } from "src/app/services/wallet-connect.service";

@Component({
  selector: "app-upgrade-nft-dialog",
  templateUrl: "./upgrade-nft-dialog.component.html",
  styleUrls: ["./upgrade-nft-dialog.component.scss"],
})
export class UpgradeNftDialogComponent implements OnInit {
  isLoading = false;
  isSelectAll = true;
  tokenIds = [];
  amounts = [];
  bridgeNftBtnTxt='Bridge NFT'
  constructor(
    private apiService: HttpApiService,
    private cs: WalletConnectService,
    @Inject(MAT_DIALOG_DATA) public nftList: any[],
    private dialogRef: MatDialogRef<UpgradeNftDialogComponent>
  ) {}

  ngOnInit(): void {
    this.nftList.forEach((item) => {
      item.isSelected = true;
      this.tokenIds.push(item.nftId);
      this.amounts.push(item.amount);
    });
  }

  // HANDLE SELECT ALL CHANGE FN
  handleOnChange(event) {
    this.isSelectAll = event.target.checked;
    for (let item of this.nftList) {
      item.isSelected = event.target.checked;
      if (item.isSelected) {
        this.tokenIds.push(item.nftId);
        this.amounts.push(item.amount);
      } else {
        this.tokenIds = [];
        this.amounts = [];
      }
    }
  }

  // HANDLE SINGLE CHANGE FN
  handleSingleChange(event, index) {
    this.nftList[index].isSelected = event.target.checked;
    this.isSelectAll = this.nftList.every((item) => item.isSelected);
    // Filter out unselected items from tokenIds and amounts arrays
    this.tokenIds = this.nftList
      .filter((item) => item.isSelected)
      .map((item) => item.nftId);
    this.amounts = this.nftList
      .filter((item) => item.isSelected)
      .map((item) => item.amount);
  }

  //BRIDGE NFT APPROVAL FN
  async handleBridgeNft() {
    try {
      this.bridgeNftBtnTxt='Bridging...'
      const isApproval = await this.cs.isApprovalBridgeNFT();
      if (!isApproval) {
        const approval = await this.cs.setApprovalBridgeNFT();
        await approval.wait();
      }
      const result = await this.cs.bridgeNFT(this.tokenIds, this.amounts, localStorage.getItem('address'))
      await result.wait();
      this.apiService.showToastr("NFTs are bridge successfully", true);
      this.dialogRef.close();

    } catch (error) {
      this.bridgeNftBtnTxt='Bridge NFT'
      this.cs.handleMetamaskError(error);
    }
  }
}
