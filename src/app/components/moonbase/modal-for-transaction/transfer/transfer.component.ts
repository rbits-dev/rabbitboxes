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
    if (undefined === userAddress || userAddress == "") {
      this.httpApi.showToastr("You must fill in an address", false);
      return
    }

    if (!Web3.utils.isAddress(userAddress)) {
      this.httpApi.showToastr("The address is not valid", false);
      return
    }

    if (this.data.walletAddress === userAddress) {
      this.httpApi.showToastr("The destination address can\'t be the same as the source address", false);
      return
    }

    try {

      this.btnText = "Waiting for confirmation";
      var transferTxn = await this.walletConnectService.safeTransfer(this.data.walletAddress, userAddress, this.data.details.nftId, ArtistNFTAddress,this.data.details.contractStandard);
        this.httpApi.transferNft({
          fromAddress: this.data.walletAddress,
          toAddress: userAddress,
          nftId: this.data.details.nftId,
          amount: 1,
          transactionHash: transferTxn.hash
        }).subscribe((response: any) => {

          this.httpApi.showToastr(response.data.message, response.isSuccess);
            this.dialog.closeAll();
            location.reload();
        });
    }
    catch (e) {
      this.btnText = "Transfer";
       this.walletConnectService.handleMetamaskError(e)
      this.dialog.closeAll();
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
