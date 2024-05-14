// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

// export const environment = {
//   production: false,
//   chainId: [11155111, 97, 80001, 1287, 4, 568, 84532],
//   openseaChainIds: [1, 3, 4, 2, 5],
//   providerURL: "https://data-seed-prebsc-2-s1.bnbchain.org:8545",
//   baseURL: "http://codetentacles-006-site31.htempurl.com/api/",
//   ownerAddress: "0x703632A0b52244fAbca04aaE138fA8EcaF72dCBC",
//   NFTAddress: "0x94f1f1B3038e11E07FbFcC82357F69691c40DF42",
//   lootBoxAddress: "0x017792D0692591FF66686092293295ef245deD3b",
//   artistNFTAddress: "0xe3D279f66776Efae7602D817f68015a0afA0Fd2E",
//   tokenContractAddress: "0x3F4E053184Bef016286D07189FB60c61A6eF972F",
//   configFile: "testnet",
//   adminPanelUrl: "http://codetentacles-006-site41.htempurl.com/",
//   moralisChain: "bsc+testnet",
//   assetBaseUrl: "/assets",

// };


export const environment = {
  production: true,
  chainId: [1, 56, 137, 1285, 2000,8453],
  openseaChainIds: [1, 3, 4,2,5],
  providerURL: "https://bsc-dataseed1.binance.org",
  baseURL: "http://localhost/rabbitNew/api/",
  ownerAddress: "0x66A7B9f608378e59105022aB00b0F541666e8c4d",
  NFTAddress: "0x82A3E038048CF02C19e60856564bE209899d4F12",
  artistNFTAddress: "0xE93ddAA2d56F1DAF39177fe875698A147bC94f69",
  tokenContractAddress: "0xa6EbCC4C5C0316191eA95BFC90F591DF23A03DFE",
  moralisChain :"bsc",
  configFile: 'mainnet',
    assetBaseUrl: "/assets",
  adminPanelUrl : "https://rbits.xyz/boxes/admin/",

};


/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
