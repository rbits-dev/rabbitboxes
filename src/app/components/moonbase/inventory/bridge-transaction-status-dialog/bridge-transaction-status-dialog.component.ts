import { Component, OnInit, Inject } from "@angular/core";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";
import { CHAIN_CONFIGS } from "src/app/components/base/wallet/connect/constants/blockchain.configs";
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
    @Inject(MAT_DIALOG_DATA) public data: any,
    private toaster: ToastrService,
    private dialogCloseAllRef: MatDialog
  ) {}

  ngOnInit(): void {
    this.handleBridgeNft();
    this.cs.listenToEvents(this.data.fromChain).then((res: any) => {
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

          this.txHashHref = CHAIN_CONFIGS[ this.data.fromChain ].config.params[0].blockExplorerUrls[0] + "tx/" + res.transactionHash;
          this.transactionHash =
          (res.transactionHash && res.transactionHash.substring(0, 4)) +
                      "..." +
                      (res.transactionHash && res.transactionHash.substring(62, 66));
        }, 30000);
      }
    });
  }

  //BRIDGE NFT APPROVAL FN
  async handleBridgeNft() {
    try {
      if (this.data.tokenIds.length != this.data.amounts.length)
        return (
          this.dialogRef.close(), this.cs.printError("Data Array Size Mismatch")
        );

      if (this.data.tokenIds.length == 0)
        return (
          this.dialogRef.close(),
          this.cs.printError("You didn't select any NFTs to bridge")
        );

      this.successIcon = true;
      const isApproval = await this.cs.isApprovalBridgeNFT(
        this.data.srcContract
      );
      if (!isApproval) {
        const approval = await this.cs.setApprovalBridgeNFT(
          this.data.srcContract
        );
        await approval.wait();
      }

      const result: any = await this.httpApi.sing({
        nftIds: this.data.tokenIds,
        amounts: this.data.amounts,
        srcContract: this.data.srcContract,
        destContract: this.data.destContract,
        userAddress: localStorage.getItem("address"),
        fromChain:this.data.fromChain
      });
      await this.tx(result.data);
    } catch (error) {
      this.dialogRef.close();
      this.cs.handleMetamaskError(error);
    }
  }

  async tx(signData) {
    try {
      const result = await this.cs.bridgeNFT(
        this.data.tokenIds,
        this.data.amounts,
        localStorage.getItem("address"),
        this.data.srcContract,
        this.data.destContract,
        signData,
        this.data.fromChain
      );
      await result.wait();
      this.successIcon = false;
      this.successIcon2 = true;
      this.btn2Text = "Done";
      this.successIcon3 = false;
      this.successIcon4 = true;
      this.btn3Text = "Started";
      setTimeout(() => {
        this.dialogCloseAllRef.closeAll();
        this.toaster.success("Your NFT will be bridge in a while.");
      }, 60000);
    } catch (error) {
      throw error;
    }
  }
}
