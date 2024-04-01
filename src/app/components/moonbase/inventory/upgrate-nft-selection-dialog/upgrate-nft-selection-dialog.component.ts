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
  isLoading = true;
  tokenIds = [];
  amounts = [];
  nftData = [];
  bridgeNftBtnTxt = "select NFT for Bridge";
  headers: any;
  userAddress: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public nftList: any[],
    private httpClient: HttpClient,
    public dialogRef: MatDialogRef<UpgrateNftSelectionDialogComponent>,
    private openDialog: MatDialog,
    private localStorage: LocalStorageService
  ) {}

  ngOnInit(): void {
    this.userAddress = this.localStorage.get("address");
    this.headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('X-API-Key', 'mPiHvsoVqeqlQTF6FkXslLhgtTgL3OKDrsp29tQPHDtyOKyuj5GlMCIfWKtOfOPC');
    this.nftList.forEach((item,index) => {
      // this.tokenIds.push(item.nftId);
      // this.amounts.push(item.amount);
        this.fetchNFTsForContract(item.BSCAddress).subscribe(
          (nfts: any) => {
            // Handle response for each contract
            this.nftData[item.BSCAddress]=nfts.result
            if(nfts.result.length > 0)
            {
              item.isDisplay=true
            }
            console.log(`NFTs for contract ${item.BSCAddress}:`, nfts);
            if(this.nftList.length-1 == index){

              this.isLoading=false
            }
          },
          error => {
            console.error(`Error fetching NFTs for contract ${item.BSCAddress}:`, error);
          }
        );


    });

  }

  // Function to fetch NFTs for a specific contract
  fetchNFTsForContract(contract: string) {

    const apiUrl = `https://deep-index.moralis.io/api/v2/${this.userAddress}/nft/${contract}?chain=${environment.moralisChain}&format=decimal`;

    return this.httpClient.get(apiUrl, { headers: this.headers });
  }







  //handle bridge nft status dialog
  openBridgeNft(srcContractAddress:string,destContractAddress:string) {
    this.openDialog.open(UpgradeNftDialogComponent, {
      width: "500px",
      data: {"nftData":this.nftData[srcContractAddress],"srcContractAddress":srcContractAddress,destContractAddress:destContractAddress},
      disableClose: true,
    });
  }
}
