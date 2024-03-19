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
  txHashHref: string = '';
  constructor(
    private cs: WalletConnectService,
    public dialogRef: MatDialogRef<BridgeTransactionStatusDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.handleBridgeNft();
    this.cs.listenToEvents().then((res:any) => {
      if (res) {
        this.successIcon4 = false;
        this.btn3Text = "Done";
        this.successIcon5 = true;
        this.btn4Text = "Started";
        this.successIcon6 = false;
        this.successIcon7 = true;
        console.log(res.transactionHash);
        setTimeout(() => {
          this.successIcon7 = false;
          this.btn4Text = "Done";
          this.successIcon8 = true;
          this.txHashHref = environment.explorerURLForEth+'tx/'+res.transactionHash
          this.transactionHash = environment.explorerURLForEth+'tx/'+res.transactionHash.substring(0,4)+'...'+res.transactionHash.substring(62,66)
        }, 30000);
      }
    });
  }

  //BRIDGE NFT APPROVAL FN
  async handleBridgeNft() {
    try {
      this.successIcon = true;
      const isApproval = await this.cs.isApprovalBridgeNFT();
      if (!isApproval) {
        const approval = await this.cs.setApprovalBridgeNFT();
        await approval.wait();
      }
      const result = await this.cs.bridgeNFT(
        this.data.tokenIds,
        this.data.amounts,
        localStorage.getItem("address")
      );
      await result.wait();
      this.successIcon = false;
      this.successIcon2 = true;
      this.btn2Text = "Done";
      this.successIcon3 = false;
      this.successIcon4 = true;
      this.btn3Text = "Started";
    } catch (error) {
      this.dialogRef.close();
      this.cs.handleMetamaskError(error);
    }
  }
}
