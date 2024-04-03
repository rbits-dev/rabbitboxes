import { Component, OnInit, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { HttpApiService } from "src/app/services/http-api.service";
import { WalletConnectService } from "src/app/services/wallet-connect.service";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-bridge-transaction-status-dialog",
  templateUrl: "./bridge-transaction-status-dialog.component.html",
  styleUrls: ["./bridge-transaction-status-dialog.component.scss"],
})
export class BridgeTransactionStatusDialogComponent implements OnInit {
  successIcon: boolean = false;
  successIcon2: boolean = false;
  successIcon3: boolean = true;
  successIcon4: boolean = false;
  successIcon5: boolean = false;
  successIcon6: boolean = true;
  successIcon7: boolean = false;
  successIcon8: boolean = false;
  btn2Text: String = "Started";
  btn3Text: String = "Waiting";
  btn4Text: String = "Waiting";
  transactionHash: String = "please wait...";
  txHashHref: string = "";
  singData: any;
  constructor(
    private cs: WalletConnectService,
    public dialogRef: MatDialogRef<BridgeTransactionStatusDialogComponent>,
    private httpApi: HttpApiService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.handleBridgeNft();
    this.cs.listenToEvents(this.data.destContract).then((res: any) => {
      if (res) {
        this.successIcon4 = false;
        this.btn3Text = "Done";
        this.successIcon5 = true;
        this.btn4Text = "Started";
        this.successIcon6 = false;
        this.successIcon7 = true;
        setTimeout(() => {
          this.successIcon7 = false;
          this.btn4Text = "Done";
          this.successIcon8 = true;
          this.txHashHref =
            environment.explorerURLForEth + "tx/" + res.transactionHash;
          this.transactionHash =
            environment.explorerURLForEth +
            "tx/" +
            res.transactionHash.substring(0, 4) +
            "..." +
            res.transactionHash.substring(62, 66);
        }, 30000);
      }
    });
  }

  //BRIDGE NFT APPROVAL FN
  async handleBridgeNft() {
    try {
      if (this.data.tokenIds.length != this.data.amounts.length) {
        this.dialogRef.close();
        this.cs.printError("Data Array Size Mismatch");
      }
      if (this.data.tokenIds.length == 0) {
        // There is nothing to do
        this.dialogRef.close();
        this.cs.printError("You didn't select any NFTs to bridge");
      } else {
        // There is something to do
        this.successIcon = true;
        const isApproval = await this.cs.isApprovalBridgeNFT(this.data.srcContract);
        if (!isApproval) {
          const approval = await this.cs.setApprovalBridgeNFT(this.data.srcContract);
          await approval.wait();
        }

           this.httpApi
            .sing({
              srcContract: this.data.srcContract,
              destContract: this.data.destContract,
              userAddress: localStorage.getItem("address"),
            })
            .subscribe((response: any) => {
              this.singData = response.data;
              this.tx()
            });
      }
    } catch (error) {
      this.dialogRef.close();
      this.cs.handleMetamaskError(error);
    }
  }

  async tx()
  {
    try {
      const result = await this.cs.bridgeNFT(
        this.data.tokenIds,
        this.data.amounts,
        localStorage.getItem("address"),
        this.data.srcContract,
        this.data.destContract,
        this.singData
      );
      await result.wait();
      this.successIcon = false;
      this.successIcon2 = true;
      this.btn2Text = "Done";
      this.successIcon3 = false;
      this.successIcon4 = true;
      this.btn3Text = "Started";
    } catch (error) {
      throw error
    }
  }

  async getsing(srcContract: string, destContract: string) {
    try {
     this.httpApi
        .sing({
          srcContract: srcContract,
          destContract: destContract,
          userAddress: localStorage.getItem("address"),
        })
        .subscribe((response: any) => {
          this.singData = response.data;
        });
    } catch (e) {
      this.dialogRef.close();
      this.httpApi.showToastr(e, false);
    }
  }
}
