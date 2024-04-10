import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Component, OnInit, Inject } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { environment } from 'src/environments/environment';
import { UpgradeNftDialogComponent } from '../upgrade-nft-dialog/upgrade-nft-dialog.component';



@Component({
  selector: 'app-upgrate-nft-selection-dialog',
  templateUrl: './upgrate-nft-selection-dialog.component.html',
  styleUrls: ['./upgrate-nft-selection-dialog.component.scss']
})
export class UpgrateNftSelectionDialogComponent implements OnInit {
  tokenIds = [];
  amounts = [];
  bridgeNftBtnTxt = "select NFT for Bridge";
  headers: any;
  userAddress: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public nftData: any,
    public dialogRef: MatDialogRef<UpgrateNftSelectionDialogComponent>,
    private openDialog: MatDialog,
  ) {}

  ngOnInit(): void {

  }

  //handle bridge nft status dialog
  openBridgeNft(srcContractAddress:string,destContractAddress:string) {
    this.openDialog.open(UpgradeNftDialogComponent, {
      width: "800px",
      data: {"nftData":this.nftData?.nftData[srcContractAddress],"srcContractAddress":srcContractAddress,destContractAddress:destContractAddress},
      disableClose: true,
    });
  }
}
