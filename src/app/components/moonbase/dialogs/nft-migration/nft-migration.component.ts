import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { HttpApiService } from 'src/app/services/http-api.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { WalletConnectService } from 'src/app/services/wallet-connect.service';


@Component({
  selector: 'app-nft-migration',
  templateUrl: './nft-migration.component.html',
  styleUrls: ['./nft-migration.component.scss'],
})
export class NftMigrationComponent implements OnInit {
  tabs: any = [];
  @ViewChild('tabGroup') tabGroup;
  userAddress: any;
  swapCount: any;
  nftCountToSwap: any;
  IsNftMigrated: any;
  isConnected: boolean;

  constructor(
    public dialogRef: MatDialogRef<NftMigrationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private httpApi: HttpApiService,
    private localstorage: LocalStorageService,
    private toastrService: ToastrService,
    private walletConnectService: WalletConnectService,
  ) { }

  ngOnInit(): void {
    this.userAddress = this.localstorage.get('address');
    this.tabs = this.data.data;
    this.swapCount = this.data.swapCount;
    this.nftCountToSwap = this.data.nftCountToSwap;
    this.isConnected = this.walletConnectService.getWalletState();
  }



  async migrate() {
    try {

      var txStatus: any;
      if (!await this.walletConnectService.isApprovedMigration(this.userAddress)) {
        let tx = await this.walletConnectService.setApprovalMigration();
        await tx.wait(3);
      }
      //FIXME: ArtistNFTAddressArray can be undefined after ngOnInit()
      txStatus = await this.walletConnectService.migrateNft(this.tabs.ArtistNFTAddressArray, this.tabs.nftIdArray, this.tabs.amountArray, this.tabs.Signature);
      if (txStatus.status) {
        let url = "userDataSwapUpdate";
        this.httpApi.postRequest(url, { nftId: this.tabs.nftIdArray, newContractAddress: this.tabs.ArtistNFTAddressArray }).subscribe(async (res: any) => {
          if (res.status == 200 && res.isSuccess) {
            this.toastrService.success(res.data.message);
            this.isNftMigratedFunction();
          }
          else {
            this.toastrService.error(res.data.message);
          }
        }, (err: any) => {
          this.toastrService.error("There was an error, please try again later.");
        })
      }

    } catch (e: any) {
      console.log(e);
      this.toastrService.error(e.hash.data.message);
    }
  }
  closeDialog() {
    this.dialogRef.close();
  }


  isNftMigratedFunction() {
    let url = "userDataCount?userAddress=" + this.userAddress;
    this.httpApi.getRequest(url).subscribe(async (res: any) => {
      if (res.status == 200) {
        this.IsNftMigrated = res.IsNftMigrated;
        if (!this.IsNftMigrated) {
          this.toastrService.success("There are " + res.nftCountToSwap + " NFTs left to Upgrade");
          //window.location.reload();
        }
        else {
          this.closeDialog();
        }
      }
    }, (err: any) => {
      console.log(err);
      this.toastrService.error("There was an error, please try again later.");
      this.closeDialog();
    })
  }
}
