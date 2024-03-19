import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SwiperModule } from 'swiper/angular';
import {RouterModule} from '@angular/router';
import { MoonbaseRoutingModule } from './moonbase-routing.module';
import { MoonbaseComponent } from './moonbase.component';
import { NavModule } from './nav/nav.module';
import { MatIconModule } from '@angular/material/icon';
// import { NgParticlesModule } from 'ng-particles';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HistoryComponent } from './history/history.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { InventoryComponent } from './inventory/inventory.component';
import { FooterCountComponent } from './footer-count/footer-count.component';
import { ModalForTransactionComponent } from './modal-for-transaction/modal-for-transaction.component';
import { ArtistMoonboxComponent } from './ArtistLootBox/artist-moonbox/artist-moonbox.component';
import { UpcomingComponent } from './ArtistLootBox/upcoming/upcoming.component';
import { AngularCountdownDateTimeModule } from 'angular-countdown-date-time';
import { CountdownTimerComponent } from './ArtistLootBox/upcoming/countdown-timer/countdown-timer.component';
import { ModalForClaimComponent } from './history/modal-for-claim/modal-for-claim.component';
import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';
import { ShareIconsModule } from 'ngx-sharebuttons/icons';
import { SocialShareComponent } from './modal-for-transaction/social-share/social-share.component';
import { SidebarModule } from '../base/sidebar/sidebar.module';
import { WalletConnectModule } from '../base/wallet/connect/connect.module';
import { LandingComponent } from './landing/landing.component';
import { LandingIntroComponent } from './landing/landing-intro/landing-intro.component';
import { UiSwitchModule } from 'ngx-ui-switch';
import { InfoComponent } from './info/info.component';
import { TransferComponent } from './modal-for-transaction/transfer/transfer.component';
import { LandingNftsComponent } from './landing/landing-nfts/landing-nfts.component';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { InfoMoonboxesComponent } from './info/info-moonboxes/info-moonboxes.component';
import { NftMigrationComponent } from './dialogs/nft-migration/nft-migration.component';
import { MaterialModule } from './material/material.module';
import { DisconnectWalletComponent } from './dialogs/disconnect-wallet/disconnect-wallet.component';
import { AddUserDialogComponent } from './ArtistLootBox/add-user-dialog/add-user-dialog.component';
import { TimerPopUPComponent } from './ArtistLootBox/upcoming/timer-pop-up/timer-pop-up.component';
import { ArtistMoonboxRouteComponent } from './artist-moonbox-route/artist-moonbox-route.component';
import { NFTCollectionsComponent } from './nftcollections/nftcollections.component';
import { UpgradeNftDialogComponent } from './inventory/upgrade-nft-dialog/upgrade-nft-dialog.component';


@NgModule({
  declarations: [
    MoonbaseComponent,
    NFTCollectionsComponent,
    CountdownTimerComponent,
    HistoryComponent,
    InventoryComponent,
    FooterCountComponent,
    ModalForTransactionComponent,
    ArtistMoonboxComponent,
    UpcomingComponent,
    CountdownTimerComponent,
    ModalForClaimComponent,
    SocialShareComponent,
    LandingComponent,
    LandingIntroComponent,
    InfoComponent,
    TransferComponent,
    LandingNftsComponent,
    InfoMoonboxesComponent,
    NftMigrationComponent,
    DisconnectWalletComponent,
    AddUserDialogComponent,
    TimerPopUPComponent,
    ArtistMoonboxRouteComponent,
    UpgradeNftDialogComponent,
  ],
  imports: [
    MatIconModule,
    CommonModule,
    MoonbaseRoutingModule,
    NavModule,
    FormsModule,
    NgxPaginationModule,
    ReactiveFormsModule,
    AngularCountdownDateTimeModule,
    ShareButtonsModule,
    ShareIconsModule,
    SidebarModule,
    WalletConnectModule,
    SwiperModule,
    UiSwitchModule,
    ClipboardModule,
    MaterialModule,
    RouterModule
  ]
})
export class MoonbaseModule { }
