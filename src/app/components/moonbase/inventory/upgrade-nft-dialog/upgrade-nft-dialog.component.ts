import { Component, OnInit, Inject } from "@angular/core";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from "@angular/material/dialog";

import { BridgeTransactionStatusDialogComponent } from "../bridge-transaction-status-dialog/bridge-transaction-status-dialog.component";

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
  bridgeNftBtnTxt = "Bridge NFT";
  constructor(
    @Inject(MAT_DIALOG_DATA) public nftList: any,
    public dialogRef: MatDialogRef<UpgradeNftDialogComponent>,
    private openDialog: MatDialog
  ) {}

  ngOnInit(): void {
    debugger
    this.nftList.nftData.forEach((item) => {
      item.isSelected = true;
      this.tokenIds.push(item.token_id);
      this.amounts.push(item.amount);
    });
  }

  // HANDLE SELECT ALL CHANGE FN
  handleOnChange(event) {
    this.isSelectAll = event.target.checked;
    for (let item of this.nftList.nftData) {
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
    this.nftList.nftData[index].isSelected = event.target.checked;
    this.isSelectAll = this.nftList.nftData.every((item) => item.isSelected);
    // Filter out unselected items from tokenIds and amounts arrays
    this.tokenIds = this.nftList.nftData
      .filter((item) => item.isSelected)
      .map((item) => item.token_id);
    this.amounts = this.nftList.nftData
      .filter((item) => item.isSelected)
      .map((item) => item.amount);
  }



  //handle bridge nft status dialog
  openBridgeNftStatusDialog(srcContract:string,destContract:string) {
    this.openDialog.open(BridgeTransactionStatusDialogComponent, {
      width: "500px",
      data: {
        tokenIds: this.tokenIds,
        amounts: this.amounts,
        srcContract:srcContract,
        destContract:destContract
      },
      disableClose: true,
    });
  }
}
