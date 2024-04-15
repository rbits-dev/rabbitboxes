import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { HttpApiService } from 'src/app/services/http-api.service';
import { WalletConnectService } from 'src/app/services/wallet-connect.service';
import Web3 from 'web3';

@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.scss']
})
export class TransferComponent {
  btnText: string = "Transfer";
  showError: boolean = false;

  constructor(public dialogRef: MatDialogRef<TransferComponent>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private walletConnectService: WalletConnectService,
    private httpApi: HttpApiService) { }

  async transfer(userAddress: any, ArtistNFTAddress: any) {
    debugger
    if (undefined === userAddress || userAddress == "") {
      this.httpApi.showToastr("You must fill in an address", false);
      return false;
    }

    if (!Web3.utils.isAddress(userAddress)) {
      this.httpApi.showToastr("The address is not valid", false);
      return false;
    }

    if (this.data.walletAddress === userAddress) {
      this.httpApi.showToastr("The destination address can\'t be the same as the source address", false);
      return false;
    }

    try {

      this.btnText = "Waiting for confirmation";
      var transferTxn = await this.walletConnectService.safeTransfer(this.data.walletAddress, userAddress, this.data.details.nftId, ArtistNFTAddress,this.data.details.contractStandard);
      if (transferTxn.status) {
        this.httpApi.transferNft({
          fromAddress: this.data.walletAddress,
          toAddress: userAddress,
          nftId: this.data.details.nftId,
          amount: 1,
          transactionHash: transferTxn.hash
        }).subscribe((response: any) => {

          this.httpApi.showToastr(response.data.message, response.isSuccess);

          if (response.isSuccess) {
            this.dialog.closeAll();
            location.reload();
          }
        });
      }
      else {
        this.btnText = "Transfer";
        if (transferTxn.error.code == 4001)
          this.httpApi.showToastr(transferTxn.error.message, false);
        else if (transferTxn.error.data)
          this.httpApi.showToastr(transferTxn.error.data?.message, false);
        else if (transferTxn.error.error)
          this.httpApi.showToastr(transferTxn.error.error?.message, false);
        this.dialog.closeAll();
        return false;
      }

    }
    catch (e) {
      this.btnText = "Transfer";
      if (e.code == 4001)
        this.httpApi.showToastr(e.message, false);
      else if (e.data)
        this.httpApi.showToastr(e.data?.message, false);
      else if (e.error)
        this.httpApi.showToastr(e.error?.message, false);

      this.dialog.closeAll();
      return false;
    }
    return true;
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
